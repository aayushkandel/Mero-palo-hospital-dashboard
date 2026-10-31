
import React, { useState, useRef, useEffect } from "react";
import MyProfile from "../forms/profileForms/MyProfile";
import PasswordChangeForm from "../forms/profileForms/PasswordChangeForm";
import DepartmentDeleteButton from "../buttons/DepartmentDeleteButton";
import { useNavigate, useParams } from "react-router-dom";

import {
    deleteDepartment,
    getDepartmentProfile,
    updateDepartmentProfile,
    departPasswordChange
} from "../../api/FetchApi";

const Profile = () => {

    const { departId } = useParams();
    const navigate = useNavigate();

    // Dropdown states
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);

    // Profile form states
    const [profileData, setProfileData] = useState({
        name: "",
        phone: "",
        department_room_no: ""
    });

    const [profileLoading, setProfileLoading] = useState(false);
    const [profileSubmitting, setProfileSubmitting] = useState(false);

    // Password form states
    const [passwordData, setPasswordData] = useState({
        old_password: "",
        new_password: "",
        confirm_new_password: ""
    });

    const [passwordError, setPasswordError] = useState("");
    const [passwordSubmitting, setPasswordSubmitting] = useState(false);

    // Notification state
    const [toast, setToast] = useState(null);

    // Refs for outside click
    const profileRef = useRef(null);
    const passwordRef = useRef(null);

    // Show notification for 5 seconds
    const showToast = (type, message) => {
        setToast({
            type,
            message,
            id: Date.now()
        });
    };

    // Automatically remove notification after 5 seconds
    useEffect(() => {
        if (!toast) return;

        const timer = setTimeout(() => {
            setToast(null);
        }, 5000);

        return () => clearTimeout(timer);
    }, [toast]);

    // Close notification if user clicks outside
    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setIsProfileOpen(false);
            }

            if (
                passwordRef.current &&
                !passwordRef.current.contains(event.target)
            ) {
                setIsPasswordOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, []);

    // Fetch department profile
    const getDepartProfile = async () => {

        try {

            setProfileLoading(true);

            const res = await getDepartmentProfile(departId);

            setProfileData({
                name: res.data.name || "",
                phone: res.data.phone || "",
                department_room_no: res.data.department_room_no || ""
            });

        } catch (error) {

            console.log(error);

            showToast(
                "error",
                error.response?.data?.detail || "Unable to fetch department profile"
            );

        } finally {
            setProfileLoading(false);
        }
    };

    // Open and close profile dropdown
    const onMyProfileClick = async () => {

        const nextState = !isProfileOpen;

        setIsProfileOpen(nextState);
        setIsPasswordOpen(false);

        if (nextState) {
            await getDepartProfile();
        }
    };

    // Profile input changes
    const handleProfileChange = (e) => {

        const { name, value } = e.target;

        setProfileData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Update department profile
    const handleProfileSubmit = async (e) => {

        e.preventDefault();

        try {

            setProfileSubmitting(true);

            const res = await updateDepartmentProfile(
                departId,
                profileData
            );

            showToast(
                "success",
                res.data.message || "Department profile updated successfully"
            );

            setIsProfileOpen(false);

        } catch (error) {

            console.log(error);

            showToast(
                "error",
                error.response?.data?.data?.detail || "Unable to update department profile"
            );

        } finally {
            setProfileSubmitting(false);
        }
    };

    // Open and close password dropdown
    const onPasswordClick = () => {

        const nextState = !isPasswordOpen;

        setIsPasswordOpen(nextState);
        setIsProfileOpen(false);

        setPasswordError("");
    };

    // Password input changes
    const handlePasswordChange = (e) => {

        const { name, value } = e.target;

        setPasswordData((prev) => ({
            ...prev,
            [name]: value
        }));

        setPasswordError("");
    };

    // Change department password
    const handlePasswordSubmit = async (e) => {

        e.preventDefault();


        try {

            setPasswordSubmitting(true);

            const passwordPayload = {
                old_password: passwordData.old_password,
                new_password: passwordData.new_password,
                confirm_new_password:passwordData.confirm_new_password
            };

            const res = await departPasswordChange(
                departId,
                passwordPayload
            );

            showToast(
                "success",
                res.data.message || "Department password changed successfully"
            );

            setIsPasswordOpen(false);

            setPasswordData({
                old_password: "",
                new_password: "",
                confirm_new_password: ""
            });

            setPasswordError("");

        } catch (error) {

            console.log(error);

            showToast(
                "error",
                error.response?.data?.detail || "Unable to change password"
            );

        } finally {
            setPasswordSubmitting(false);
        }
    };

    // Delete department
    const handleDeleteProfile = async () => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this department?"
        );

        if (!confirmed) return;

        try {

            const res = await deleteDepartment(departId);

            showToast(
                "success",
                res.data.message || "Department deleted successfully"
            );

            // Navigate after the notification has been displayed
            setTimeout(() => {
                navigate("/dashboard");
            }, 5000);

        } catch (error) {

            console.log(error);

            showToast(
                "error",
                error.response?.data?.detail || "Unable to delete department"
            );
        }
    };

    return (
        <div className="relative flex items-center space-x-4">

            {/* Notification */}
            {toast && (
                <div
                    key={toast.id}
                    className={`fixed top-5 right-5 z-[100] w-80 overflow-hidden rounded-lg border shadow-xl ${
                        toast.type === "success"
                            ? "bg-white border-green-200 dark:bg-gray-800"
                            : "bg-white border-red-200 dark:bg-gray-800"
                    }`}
                >

                    <div className="flex items-start justify-between gap-3 p-4">

                        <div className="flex items-start gap-3">

                            <div
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white ${
                                    toast.type === "success"
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                }`}
                            >
                                {toast.type === "success" ? "✓" : "!"}
                            </div>

                            <div>
                                <p className={`text-sm font-semibold ${
                                    toast.type === "success"
                                        ? "text-green-700 dark:text-green-400"
                                        : "text-red-700 dark:text-red-400"
                                }`}>
                                    {toast.type === "success" ? "Success" : "Error"}
                                </p>

                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 break-words">
                                    {toast.message}
                                </p>
                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={() => setToast(null)}
                            className="text-gray-400 hover:text-gray-700 dark:hover:text-white text-xl leading-none"
                        >
                            ×
                        </button>

                    </div>

                    {/* 5-second progress line */}
                    <div className="h-1 w-full bg-gray-200 dark:bg-gray-700">
                        <div
                            className={`toast-progress h-full ${
                                toast.type === "success"
                                    ? "bg-green-500"
                                    : "bg-red-500"
                            }`}
                        />
                    </div>

                </div>
            )}

            {/* My Profile */}
            <div
                className="relative inline-block text-left"
                ref={profileRef}
            >

                <button
                    onClick={onMyProfileClick}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                    <span>My Profile</span>
                    <span>{isProfileOpen ? "▲" : "▼"}</span>
                </button>

                <MyProfile
                    isProfileOpen={isProfileOpen}
                    profileData={profileData}
                    handleProfileChange={handleProfileChange}
                    handleProfileSubmit={handleProfileSubmit}
                    profileLoading={profileLoading}
                    profileSubmitting={profileSubmitting}
                />

            </div>

            {/* Change Password */}
            <div
                className="relative inline-block text-left"
                ref={passwordRef}
            >

                <button
                    onClick={onPasswordClick}
                    className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                    <span>Change Password</span>
                    <span>{isPasswordOpen ? "▲" : "▼"}</span>
                </button>

                <PasswordChangeForm
                    isPasswordOpen={isPasswordOpen}
                    handlePasswordSubmit={handlePasswordSubmit}
                    passwordData={passwordData}
                    handlePasswordChange={handlePasswordChange}
                    passwordError={passwordError}
                    passwordSubmitting={passwordSubmitting}
                />

            </div>

            {/* Delete Department */}
            <DepartmentDeleteButton
                handleDeleteProfile={handleDeleteProfile}
            />

        </div>
    );
};

export default Profile;
