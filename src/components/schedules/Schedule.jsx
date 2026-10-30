
import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import ScheduleForm from '../forms/SchedulesForm';
import { getScheduleByDates } from '../../api/FetchApi';
import { useParams } from 'react-router-dom';

const Schedule = () => {
    const { departId } = useParams();

    const [dateError, setDateError] = useState("");
    const [getSchedules, setGetSchedules] = useState([]);
    const [selectedDates, setSelectedDates] = useState([]);
    const [month, setMonth] = useState(new Date());
    const [hoveredDate, setHoveredDate] = useState(null);
    const [loadingSchedules, setLoadingSchedules] = useState(false);

    // Default mode is ADD
    const [formMode, setFormMode] = useState("add");

    // Refresh schedules after adding or updating
    const [refreshSchedules, setRefreshSchedules] = useState(0);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    // Fetch schedules for every day in the displayed month
    useEffect(() => {
        const getDepartmentSchedule = async () => {
            try {
                setLoadingSchedules(true);

                const year = month.getFullYear();
                const monthIndex = month.getMonth();

                const firstDay = new Date(year, monthIndex, 1);
                const lastDay = new Date(year, monthIndex + 1, 0);

                const dates = [];

                for (
                    let day = new Date(firstDay);
                    day <= lastDay;
                    day.setDate(day.getDate() + 1)
                ) {
                    dates.push(formatDate(day));
                }

                const res = await getScheduleByDates(departId, {
                    dates: dates
                });

                setGetSchedules(
                    Array.isArray(res.data) ? res.data : []
                );

            } catch (error) {
                console.log(
                    "Error fetching schedules:",
                    error.response?.data || error
                );

                setGetSchedules([]);
            } finally {
                setLoadingSchedules(false);
            }
        };

        if (departId) {
            getDepartmentSchedule();
        }
    }, [departId, month, refreshSchedules]);

    // Find schedule for a particular date
    const getScheduleForDate = (date) => {
        const formattedDate = formatDate(date);

        return getSchedules.find(
            (schedule) => schedule.date === formattedDate
        );
    };

    // Validate selected dates according to ADD or UPDATE mode
    const validateSelectedDates = (dates, mode = formMode) => {

        if (!dates || dates.length === 0) {
            return "";
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check past dates
        const pastDates = dates.filter((date) => {
            const selectedDate = new Date(date);
            selectedDate.setHours(0, 0, 0, 0);

            return selectedDate < today;
        });

        if (pastDates.length > 0) {
            return "Please select dates from today onwards.";
        }

        // Find dates which already have schedules
        const existingDates = dates.filter(
            (date) => getScheduleForDate(date)
        );

        // Find dates which don't have schedules
        const missingDates = dates.filter(
            (date) => !getScheduleForDate(date)
        );

        // ADD mode validation
        if (mode === "add" && existingDates.length > 0) {

            const formatted = existingDates
                .map((date) => formatDate(date))
                .join(", ");

            return `These dates already have schedules: ${formatted}`;
        }

        // UPDATE mode validation
        if (mode === "update" && missingDates.length > 0) {

            const formatted = missingDates
                .map((date) => formatDate(date))
                .join(", ");

            return `These dates have no schedule: ${formatted}`;
        }

        return "";
    };

    // Handle calendar date selection
    const handleDateSelect = (dates) => {

        if (!dates || dates.length === 0) {
            setSelectedDates([]);
            setDateError("");
            return;
        }

        setSelectedDates(dates);

        const validationError = validateSelectedDates(
            dates,
            formMode
        );

        setDateError(validationError);
    };

    // Switch between ADD and UPDATE
    const handleFormMode = (mode) => {

        setFormMode(mode);

        const validationError = validateSelectedDates(
            selectedDates,
            mode
        );

        setDateError(validationError);
    };

    // Refresh after successful create/update
    const handleScheduleSaved = () => {
        setSelectedDates([]);
        setDateError("");
        setRefreshSchedules((prev) => prev + 1);
    };

    // Custom calendar day button
    const CustomDayButton = (props) => {

        const {
            day,
            modifiers,
            className,
            children,
            ...buttonProps
        } = props;

        const schedule = getScheduleForDate(day.date);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const currentDate = new Date(day.date);
        currentDate.setHours(0, 0, 0, 0);

        const isPastDate = currentDate < today;
        const isToday = currentDate.getTime() === today.getTime();

        let backgroundColor = "#d1d5db";
        let textColor = "#374151";

        if (schedule) {
            if (Number(schedule.open_status) === 0) {
                backgroundColor = "#16a34a";
                textColor = "#ffffff";
            } else {
                backgroundColor = "#dc2626";
                textColor = "#ffffff";
            }
        }

        // Fade past dates
        if (isPastDate) {
            if (schedule) {
                backgroundColor =
                    Number(schedule.open_status) === 0
                        ? "#4ade80"
                        : "#f87171";

                textColor = "#374151";
            } else {
                backgroundColor = "#c4c4c4";
            }
        }

        if (modifiers.disabled || modifiers.outside) {
            backgroundColor = undefined;
            textColor = undefined;
        }

        return (
            <button
                {...buttonProps}
                className={className}
                style={{
                    ...buttonProps.style,

                    backgroundColor,
                    color: textColor,

                    width: "34px",
                    height: "34px",
                    minWidth: "34px",
                    padding: "0",
                    margin: "2px auto",

                    borderRadius: "8px",
                    fontWeight: "600",

                    border: isToday
                        ? "2px solid #2563eb"
                        : modifiers.selected
                        ? "2px solid #2563eb"
                        : "2px solid transparent",

                    boxSizing: "border-box",
                }}
            >
                {children}
            </button>
        );
    };

    // Get hovered date schedule
    const hoveredSchedule = hoveredDate
        ? getScheduleForDate(hoveredDate)
        : null;

    const formatTime = (time) => {
        if (!time) return "Not set";

        return time.slice(0, 5);
    };

    return (
        <div className="flex flex-col gap-4 md:flex-row">

            {/* CALENDAR SECTION */}
            <div className="relative rounded-lg p-4 shadow-sm">

                {/* Calendar legend */}
                <div className="mb-3 flex flex-wrap gap-3 text-sm">

                    <span className="flex items-center gap-1">
                        <span className="h-3 w-3 rounded bg-green-600" />
                        Open
                    </span>

                    <span className="flex items-center gap-1">
                        <span className="h-3 w-3 rounded bg-red-600" />
                        Closed
                    </span>

                    <span className="flex items-center gap-1">
                        <span className="h-3 w-3 rounded bg-gray-300" />
                        No schedule
                    </span>

                </div>

                {/* Calendar */}
                <DayPicker
                    mode="multiple"
                    month={month}
                    onMonthChange={setMonth}
                    selected={selectedDates}
                    onSelect={handleDateSelect}

                    onDayMouseEnter={(day) => {
                        setHoveredDate(day);
                    }}

                    onDayMouseLeave={() => {
                        setHoveredDate(null);
                    }}

                    components={{
                        DayButton: CustomDayButton,
                    }}
                />

                {/* Hover popup */}
                {hoveredDate && (
                    <div
                        className="
                            absolute
                            left-1/2
                            top-0
                            z-50
                            w-64
                            -translate-x-1/2
                            rounded-lg
                            border
                            border-gray-200
                            bg-white
                            p-4
                            shadow-xl
                            pointer-events-none
                        "
                    >

                        <h3 className="mb-2 font-semibold text-gray-800">
                            {formatDate(hoveredDate)}
                        </h3>

                        {loadingSchedules ? (
                            <p className="text-sm text-gray-500">
                                Loading schedule...
                            </p>
                        ) : !hoveredSchedule ? (
                            <p className="text-sm font-medium text-gray-500">
                                No schedule
                            </p>
                        ) : Number(hoveredSchedule.open_status) === 0 ? (

                            <div className="space-y-2 text-sm text-gray-700">

                                <p className="font-semibold text-green-700">
                                    Schedule is Open
                                </p>

                                <p>
                                    Registration Start:{" "}
                                    {formatTime(
                                        hoveredSchedule.registration_start
                                    )}
                                </p>

                                <p>
                                    Token Start:{" "}
                                    {formatTime(
                                        hoveredSchedule.token_start
                                    )}
                                </p>

                                <p>
                                    Registration Close:{" "}
                                    {formatTime(
                                        hoveredSchedule.registration_close
                                    )}
                                </p>

                            </div>

                        ) : (

                            <p className="text-sm font-semibold text-red-600">
                                Schedule is Closed
                            </p>

                        )}

                    </div>
                )}

                {loadingSchedules && (
                    <p className="mt-2 text-xs text-gray-500">
                        Updating schedules...
                    </p>
                )}

                {/* ADD / UPDATE BUTTONS */}
                <div className="mt-5 grid grid-cols-2 gap-3">

                    <button
                        type="button"
                        onClick={() => handleFormMode("add")}
                        className={`rounded-lg px-5 py-2.5 font-medium text-white transition ${
                            formMode === "add"
                                ? "bg-green-600 ring-2 ring-green-300"
                                : "bg-gray-400 hover:bg-green-500"
                        }`}
                    >
                        + Add
                    </button>

                    <button
                        type="button"
                        onClick={() => handleFormMode("update")}
                        className={`rounded-lg px-5 py-2.5 font-medium text-white transition ${
                            formMode === "update"
                                ? "bg-blue-600 ring-2 ring-blue-300"
                                : "bg-gray-400 hover:bg-blue-500"
                        }`}
                    >
                        Update
                    </button>

                </div>

            </div>

            {/* SCHEDULE FORM */}
            <ScheduleForm
                selectedDates={selectedDates}
                dateError={dateError}
                setSelectedDates={setSelectedDates}
                formMode={formMode}
                getSchedules={getSchedules}
                onScheduleSaved={handleScheduleSaved}
            />

        </div>
    );
};

export default Schedule;
