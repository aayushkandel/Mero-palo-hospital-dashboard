
import React from "react";

const MyProfile = ({
    isProfileOpen,
    profileData,
    handleProfileChange,
    handleProfileSubmit,
    profileLoading,
    profileSubmitting
}) => {

    return (
        <div
            className={`absolute  mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden transition-all duration-300 ease-in-out ${
                isProfileOpen
                    ? "max-h-[450px] opacity-100 visible"
                    : "max-h-0 opacity-0 invisible"
            }`}
        >

            <div className="p-5">

                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                    Update Profile
                </h3>

                {profileLoading ? (

                    <p className="text-sm text-gray-500 text-center py-6">
                        Loading department profile...
                    </p>

                ) : (

                    <form
                        onSubmit={handleProfileSubmit}
                        className="space-y-4"
                    >

                        <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Department Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={profileData.name}
                                onChange={handleProfileChange}
                                placeholder="e.g. Cardiology"
                                required
                                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Contact Number
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                value={profileData.phone}
                                onChange={handleProfileChange}
                                placeholder="Enter contact number"
                                required
                                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Department Room Number
                            </label>

                            <input
                                type="text"
                                name="department_room_no"
                                value={profileData.department_room_no}
                                onChange={handleProfileChange}
                                placeholder="e.g. Room 402-B"
                                required
                                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="pt-2 flex justify-end">

                            <button
                                type="submit"
                                disabled={profileSubmitting}
                                className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-md"
                            >
                                {profileSubmitting
                                    ? "Updating..."
                                    : "Save Profile"}
                            </button>

                        </div>

                    </form>

                )}

            </div>

        </div>
    );
};

export default MyProfile;
