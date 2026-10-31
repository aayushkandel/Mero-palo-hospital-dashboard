
import React from "react";

const PasswordChangeForm = ({
    isPasswordOpen,
    handlePasswordSubmit,
    passwordData,
    handlePasswordChange,
    passwordError,
    passwordSubmitting
}) => {

    return (
        <div
            className={`absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden transition-all duration-300 ease-in-out ${
                isPasswordOpen
                    ? "max-h-[450px] opacity-100 visible"
                    : "max-h-0 opacity-0 invisible"
            }`}
        >

            <div className="p-5">

                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                    Change Password
                </h3>

                <form
                    onSubmit={handlePasswordSubmit}
                    className="space-y-4"
                >

                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Old Password
                        </label>

                        <input
                            type="password"
                            name="old_password"
                            value={passwordData.old_password}
                            onChange={handlePasswordChange}
                            placeholder="Enter old password"
                            required
                            className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            New Password
                        </label>

                        <input
                            type="password"
                            name="new_password"
                            value={passwordData.new_password}
                            onChange={handlePasswordChange}
                            placeholder="Enter new password"
                            required
                            className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Confirm New Password
                        </label>

                        <input
                            type="password"
                            name="confirm_new_password"
                            value={passwordData.confirm_new_password}
                            onChange={handlePasswordChange}
                            placeholder="Confirm new password"
                            required
                            className={`w-full px-3 py-2 text-sm rounded-md border bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ${
                                passwordError
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                            }`}
                        />

                        {passwordError && (
                            <p className="mt-1 text-xs text-red-500">
                                {passwordError}
                            </p>
                        )}
                    </div>

                    <div className="pt-2 flex justify-end">

                        <button
                            type="submit"
                            disabled={passwordSubmitting}
                            className="px-4 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-md"
                        >
                            {passwordSubmitting
                                ? "Updating..."
                                : "Update Password"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default PasswordChangeForm;
