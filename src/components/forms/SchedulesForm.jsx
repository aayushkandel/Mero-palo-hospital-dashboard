
import React, { useState, useEffect } from "react";
import {
    postSchedulesByDates,
    updateScheduleByDates
} from "../../api/FetchApi";

import { useParams } from "react-router-dom";

const ScheduleForm = ({
    selectedDates,
    dateError,
    setSelectedDates,
    formMode,
    getSchedules,
    onScheduleSaved
}) => {

    const { departId } = useParams();

    const [openStatus, setOpenStatus] = useState(0);

    const [schueduleSuccess, setScheduleSuccess] = useState(null);

    const [error, setError] = useState(null);

    const [submitting, setSubmitting] = useState(false);

    const [schedule, setSchedule] = useState({
        registration_start: "",
        registration_close: "",
        token_start: ""
    });

    // Convert backend time to input time format
    const formatTime = (time) => {
        if (!time) return "";

        return time.slice(0, 5);
    };

    // Load existing schedule when UPDATE mode is selected
    useEffect(() => {

        if (formMode === "update" && selectedDates.length > 0) {

            const selectedDate = selectedDates[0];

            const formattedDate = [
                selectedDate.getFullYear(),
                String(selectedDate.getMonth() + 1).padStart(2, "0"),
                String(selectedDate.getDate()).padStart(2, "0")
            ].join("-");

            const existingSchedule = getSchedules.find(
                (item) => item.date === formattedDate
            );

            if (existingSchedule) {

                setSchedule({
                    registration_start: formatTime(
                        existingSchedule.registration_start
                    ),

                    registration_close: formatTime(
                        existingSchedule.registration_close
                    ),

                    token_start: formatTime(
                        existingSchedule.token_start
                    )
                });

                setOpenStatus(
                    Number(existingSchedule.open_status)
                );
            }
        }

    }, [formMode, selectedDates, getSchedules]);

    // Reset fields when switching to ADD mode
    useEffect(() => {

        if (formMode === "add") {

            setSchedule({
                registration_start: "",
                registration_close: "",
                token_start: ""
            });

            setOpenStatus(0);
        }

        setError(null);
        setScheduleSuccess(null);

    }, [formMode]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setSchedule(prev => ({
            ...prev,
            [name]: value
        }));

        setError(null);
    };

    const removeDate = (dateToRemove) => {

        setSelectedDates(prev =>
            prev.filter(
                date => date.getTime() !== dateToRemove.getTime()
            )
        );
    };

    // Format selected dates
    const formattedDates = selectedDates.map(date => {

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    });

    // Data sent to backend
    const formData = {
        dates: formattedDates,

        registration_start:
            openStatus === 0
                ? schedule.registration_start || null
                : null,

        registration_close:
            openStatus === 0
                ? schedule.registration_close || null
                : null,

        token_start:
            openStatus === 0
                ? schedule.token_start || null
                : null,

        open_status: openStatus
    };

    // Submit schedule to backend
    const postDepartmentSchedule = async (departId, formData) => {

        try {

            setSubmitting(true);
            setError(null);
            setScheduleSuccess(null);

            let res;

            if (formMode === "add") {

                // POST request
                res = await postSchedulesByDates(
                    departId,
                    formData
                );

            } else {

                // PUT request
                res = await updateScheduleByDates(
                    departId,
                    formData
                );

            }

            console.log("Schedule:", res.data);

            setScheduleSuccess(
                formMode === "add"
                    ? "Schedule Created Successfully"
                    : "Schedule Updated Successfully"
            );

            // Refresh calendar data
            onScheduleSaved();

        } catch (error) {

            console.log("Status", error);

            if (error.response) {

                const detail = error.response.data.detail;

                setError(
                    Array.isArray(detail)
                        ? detail.map(item => item.msg).join(", ")
                        : typeof detail === "string"
                        ? detail
                        : "Something went wrong"
                );

            } else {

                setError("Something went wrong");

            }

        } finally {

            setSubmitting(false);

        }
    };

    // Form submission
    const handleSubmit = async (e) => {

        e.preventDefault();

        setError(null);

        if (selectedDates.length === 0) {
            setError("Please select at least one date.");
            return;
        }

        if (dateError) {
            setError(dateError);
            return;
        }

        // Validate time fields when department is OPEN
        if (openStatus === 0) {

            if (
                !schedule.registration_start ||
                !schedule.registration_close ||
                !schedule.token_start
            ) {
                setError("Please fill all the time fields.");
                return;
            }

            if (
                schedule.registration_start >=
                schedule.registration_close
            ) {
                setError(
                    "Registration start must be earlier than registration close."
                );
                return;
            }
        }

        await postDepartmentSchedule(departId, formData);
    };

    return (

        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">

            {/* FORM HEADING */}
            <div className="mb-6">

                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">

                    {formMode === "add"
                        ? "Add Schedule"
                        : "Update Schedule"}

                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">

                    {formMode === "add"
                        ? "Create schedules for selected dates."
                        : "Update schedules for selected dates."}

                </p>

            </div>

            <form
                className="space-y-6"
                onSubmit={handleSubmit}
            >

                {/* SUCCESS MESSAGE */}
                {schueduleSuccess && (

                    <div className="bg-green-100 text-green-600 p-3 rounded-md mb-4 flex justify-between">

                        {schueduleSuccess}

                        <span
                            onClick={() => setScheduleSuccess(null)}
                            className="cursor-pointer"
                        >
                            ❌
                        </span>

                    </div>

                )}

                {/* ERROR MESSAGE */}
                {error && (

                    <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4 flex justify-between">

                        {error}

                        <span
                            onClick={() => setError(null)}
                            className="cursor-pointer"
                        >
                            ❌
                        </span>

                    </div>

                )}

                {/* DATE SELECTION */}
                <div>

                    {dateError && (

                        <p className="text-red-500 text-sm mt-2 mb-2">
                            {dateError}
                        </p>

                    )}

                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">

                        Appointment Dates

                    </label>

                    <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-2 min-h-[100px] p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">

                        {selectedDates.length === 0 ? (

                            <p className="text-sm text-gray-400 col-span-full">
                                No dates selected
                            </p>

                        ) : (

                            selectedDates.map((date, index) => (

                                <div
                                    key={index}
                                    className="min-w-0 h-10 justify-center flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 text-sm"
                                >

                                    <span className="truncate">
                                        {date.toLocaleDateString("en-CA")}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() => removeDate(date)}
                                        className="font-bold hover:text-red-500"
                                    >
                                        ×
                                    </button>

                                </div>

                            ))

                        )}

                    </div>

                </div>

                {/* TIME FIELDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <div>

                        <label
                            htmlFor="registration_start"
                            className="block text-sm mb-2 dark:text-gray-300"
                        >
                            Registration Start
                        </label>

                        <input
                            type="time"
                            id="registration_start"
                            name="registration_start"
                            value={schedule.registration_start}
                            onChange={handleChange}
                            disabled={openStatus === 1}
                            required={openStatus === 0}
                            className="w-full px-4 py-2.5 rounded-lg border dark:bg-gray-700 dark:text-white"
                        />

                    </div>

                    <div>

                        <label
                            htmlFor="token_start"
                            className="block text-sm mb-2 dark:text-gray-300"
                        >
                            Token Start Time
                        </label>

                        <input
                            type="time"
                            id="token_start"
                            name="token_start"
                            value={schedule.token_start}
                            onChange={handleChange}
                            disabled={openStatus === 1}
                            required={openStatus === 0}
                            className="w-full px-4 py-2.5 rounded-lg border dark:bg-gray-700 dark:text-white"
                        />

                    </div>

                    <div>

                        <label
                            htmlFor="registration_close"
                            className="block text-sm mb-2 dark:text-gray-300"
                        >
                            Registration Close
                        </label>

                        <input
                            type="time"
                            id="registration_close"
                            name="registration_close"
                            value={schedule.registration_close}
                            onChange={handleChange}
                            disabled={openStatus === 1}
                            required={openStatus === 0}
                            className="w-full px-4 py-2.5 rounded-lg border dark:bg-gray-700 dark:text-white"
                        />

                    </div>

                </div>

                {/* DEPARTMENT STATUS */}
                <div className="space-y-3 pt-2">

                    <label className="block dark:text-gray-300">
                        Department Status
                    </label>

                    <div className="flex gap-3">

                        <button
                            type="button"
                            onClick={() => setOpenStatus(0)}
                            className={`px-4 py-2 rounded text-white ${
                                openStatus === 0
                                    ? "bg-green-600"
                                    : "bg-gray-400"
                            }`}
                        >
                            Open
                        </button>

                        <button
                            type="button"
                            onClick={() => setOpenStatus(1)}
                            className={`px-4 py-2 rounded text-white ${
                                openStatus === 1
                                    ? "bg-red-600"
                                    : "bg-gray-400"
                            }`}
                        >
                            Close
                        </button>

                    </div>

                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">

                    <button
                        type="submit"
                        disabled={
                            submitting ||
                            selectedDates.length === 0 ||
                            Boolean(dateError)
                        }
                        className={`w-full md:w-auto px-6 py-2.5 text-white font-medium rounded-lg transition ${
                            formMode === "add"
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-blue-600 hover:bg-blue-700"
                        } disabled:bg-gray-400 disabled:cursor-not-allowed`}
                    >

                        {submitting
                            ? "Please wait..."
                            : formMode === "add"
                            ? "Save Schedule"
                            : "Update Schedule"}

                    </button>

                </div>

            </form>

        </div>
    );
};

export default ScheduleForm;
