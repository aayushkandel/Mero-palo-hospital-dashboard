
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import {
    getDepartmentGallary,
    postDepartmentGallary,
    updateDepartmentThumbnail,
    deleteDepartmentImage
} from "../../api/FetchApi";

const DepartmentGallery = () => {

    const { departId } = useParams();

    const fileInputRef = useRef(null);

    const [images, setImages] = useState([]);

    const [thumbnail, setThumbnail] = useState(null);

    // Modes: view, selectThumbnail, selectDelete
    const [mode, setMode] = useState("view");

    const [thumbnailId, setThumbnailId] = useState(null);

    const [selectedForDelete, setSelectedForDelete] = useState([]);

    const [loading, setLoading] = useState(true);

    const [uploading, setUploading] = useState(false);

    const [saving, setSaving] = useState(false);

    const [deleting, setDeleting] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // Fetch department gallery
    const fetchGallery = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await getDepartmentGallary(departId);

            const data = response.data;

            setImages(data.images || []);

            setThumbnail(data.thumbnail || null);

            // Find the current thumbnail image ID
            const currentThumbnail = (data.images || []).find(
                (image) => image.image === data.thumbnail
            );

            setThumbnailId(currentThumbnail?.id || null);

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Failed to fetch department gallery"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchGallery();

    }, [departId]);


    // Add images
    const handleAddImage = async (event) => {

        const selectedFiles = Array.from(event.target.files || []);

        if (selectedFiles.length === 0) return;

        try {

            setUploading(true);
            setError("");
            setSuccess("");

            await postDepartmentGallary(departId, selectedFiles);

            setSuccess("Images uploaded successfully");

            await fetchGallery();

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Failed to upload images"
            );

        } finally {

            setUploading(false);

            // Allow selecting the same file again
            event.target.value = "";

        }
    };


    // Select thumbnail
    const handleSelectThumbnail = (id) => {

        setThumbnailId(id);

    };


    // Save thumbnail
    const handleSaveThumbnail = async () => {

        if (!thumbnailId) return;

        try {

            setSaving(true);
            setError("");
            setSuccess("");

            await updateDepartmentThumbnail(
                departId,
                thumbnailId
            );

            await fetchGallery();

            setMode("view");

            setSuccess("Department thumbnail updated successfully");

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Failed to update thumbnail"
            );

        } finally {

            setSaving(false);

        }
    };


    // Select images for deletion
    const handleSelectForDelete = (id) => {

        setSelectedForDelete((previous) => {

            if (previous.includes(id)) {

                return previous.filter((item) => item !== id);

            }

            return [...previous, id];

        });

    };


    // Delete selected images
    const confirmDelete = async () => {

        if (selectedForDelete.length === 0) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete ${selectedForDelete.length} image(s)?`
        );

        if (!confirmed) return;

        try {

            setDeleting(true);
            setError("");
            setSuccess("");

            // Your backend currently has a single-image delete endpoint.
            // Therefore, call it once for each selected image.
            await Promise.all(
                selectedForDelete.map((id) =>
                    deleteDepartmentImage(departId, id)
                )
            );

            setSelectedForDelete([]);

            setMode("view");

            await fetchGallery();

            setSuccess("Selected images deleted successfully");

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Failed to delete selected images"
            );

            // Refresh because some requests may have succeeded
            await fetchGallery();

        } finally {

            setDeleting(false);

        }
    };


    // Cancel selection mode
    const cancelMode = () => {

        setMode("view");

        setSelectedForDelete([]);

        const currentThumbnail = images.find(
            (image) => image.image === thumbnail
        );

        setThumbnailId(currentThumbnail?.id || null);

    };


    // Current selected thumbnail
    const selectedThumbnailData = images.find(
        (image) => image.id === thumbnailId
    );


    // Image URL
    // Assumes image.image contains a browser-accessible image URL/path.
   const getImageUrl = (imagePath) => {
    if (!imagePath) return "";

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
        return imagePath;
    }

    return `http://127.0.0.1:8000/${imagePath.replace(/^\/+/, "")}`;
};

    return (

        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">

            {/* Header */}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">

                <div>

                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">

                        Department Gallery

                    </h2>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">

                        Manage department photos and thumbnail

                    </p>

                </div>


                <div className="flex flex-wrap items-center gap-3">

                    {/* Add images */}

                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        ref={fileInputRef}
                        onChange={handleAddImage}
                        className="hidden"
                    />

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                    >

                        <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>

                        {uploading ? "Uploading..." : "Add Images"}

                    </button>


                    {/* Selection buttons */}

                    {images.length > 0 && mode === "view" && (

                        <>

                            <button
                                type="button"
                                onClick={() => setMode("selectThumbnail")}
                                className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                            >
                                Set Thumbnail Image
                            </button>


                            <button
                                type="button"
                                onClick={() => setMode("selectDelete")}
                                className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 text-sm font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                            >
                                Delete
                            </button>

                        </>

                    )}


                    {/* Cancel */}

                    {mode !== "view" && (

                        <button
                            type="button"
                            onClick={cancelMode}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>

                    )}

                </div>

            </div>


            {/* Success message */}

            {success && (

                <div className="mb-5 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-sm text-green-700 dark:text-green-400">

                    {success}

                </div>

            )}


            {/* Error message */}

            {error && (

                <div className="mb-5 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400">

                    {error}

                </div>

            )}


            {/* Loading */}

            {loading ? (

                <div className="text-center py-20 text-gray-500 dark:text-gray-400">

                    Loading department gallery...

                </div>

            ) : (

                <>

                    {/* Thumbnail selection area */}

                    {mode === "selectThumbnail" && (

                        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                            <div>

                                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">

                                    Selected Thumbnail

                                </h3>

                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">

                                    Select one image from your department gallery.

                                </p>

                            </div>


                            {selectedThumbnailData ? (

                                <div className="flex items-center gap-3">

                                    <img
                                        src={getImageUrl(selectedThumbnailData.image)}
                                        alt="Selected thumbnail"
                                        className="w-16 h-16 object-cover rounded-md shadow-sm border border-gray-300 dark:border-gray-600"
                                    />

                                    <button
                                        type="button"
                                        onClick={handleSaveThumbnail}
                                        disabled={saving}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                                    >

                                        {saving ? "Saving..." : "Save Thumbnail"}

                                    </button>

                                </div>

                            ) : (

                                <span className="text-sm text-gray-400 dark:text-gray-500 italic">

                                    No image selected yet

                                </span>

                            )}

                        </div>

                    )}


                    {/* Delete selection area */}

                    {mode === "selectDelete" && (

                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                            <div>

                                <h3 className="text-sm font-semibold text-red-800 dark:text-red-400">

                                    Delete Images

                                </h3>

                                <p className="text-xs text-red-600 dark:text-red-500 mt-1">

                                    {selectedForDelete.length} image(s) selected for deletion.

                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={confirmDelete}
                                disabled={
                                    selectedForDelete.length === 0 ||
                                    deleting
                                }
                                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm bg-red-600 hover:bg-red-700 disabled:bg-red-300 dark:disabled:bg-red-800/50 disabled:cursor-not-allowed text-white"
                            >

                                {deleting ? "Deleting..." : "Confirm Delete"}

                            </button>

                        </div>

                    )}


                    {/* Image grid */}

                    {images.length === 0 ? (

                        <div className="text-center py-20 text-gray-500 dark:text-gray-400">

                            <svg
                                className="w-12 h-12 mx-auto mb-3 opacity-50"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm0 10l5-5 4 4 3-3 6 6M9 9h.01"
                                />
                            </svg>

                            No images uploaded yet. Click "Add Images" to start.

                        </div>

                    ) : (

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                            {images.map((image) => {

                                const isThumbnail =
                                    thumbnail === image.image;

                                const isSelectedForDelete =
                                    selectedForDelete.includes(image.id);

                                const isSelected =
                                    thumbnailId === image.id;

                                return (

                                    <div
                                        key={image.id}
                                        onClick={() => {

                                            if (mode === "selectThumbnail") {
                                                handleSelectThumbnail(image.id);
                                            }

                                            if (mode === "selectDelete") {
                                                handleSelectForDelete(image.id);
                                            }

                                        }}
                                        className={`relative group rounded-xl overflow-hidden border-2 transition-all duration-200 aspect-square

                                            ${isThumbnail && mode !== "selectThumbnail"
                                                ? "border-green-500 shadow-md"
                                                : "border-transparent"
                                            }

                                            ${mode === "selectThumbnail" && isSelected
                                                ? "border-green-500 shadow-md"
                                                : ""
                                            }

                                            ${isSelectedForDelete
                                                ? "border-red-500 opacity-75"
                                                : ""
                                            }

                                            ${mode !== "view"
                                                ? "cursor-pointer"
                                                : ""
                                            }
                                        `}
                                    >

                                        <img
                                            src={getImageUrl(image.image)}
                                            alt={`Department gallery ${image.id}`}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />


                                        {/* Selection overlay */}

                                        {mode !== "view" && (

                                            <div className="absolute inset-0 bg-black/30 flex items-start justify-end p-2">

                                                {/* Thumbnail selection */}

                                                {mode === "selectThumbnail" && (

                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors

                                                        ${isSelected
                                                            ? "bg-green-500 border-green-500"
                                                            : "bg-white/80 border-gray-400"
                                                        }
                                                    `}>

                                                        {isSelected && (

                                                            <div className="w-2.5 h-2.5 bg-white rounded-full"></div>

                                                        )}

                                                    </div>

                                                )}


                                                {/* Delete selection */}

                                                {mode === "selectDelete" && (

                                                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors

                                                        ${isSelectedForDelete
                                                            ? "bg-red-500 border-red-500"
                                                            : "bg-white/80 border-gray-400"
                                                        }
                                                    `}>

                                                        {isSelectedForDelete && (

                                                            <svg
                                                                className="w-4 h-4 text-white"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="3"
                                                                    d="M5 13l4 4L19 7"
                                                                />
                                                            </svg>

                                                        )}

                                                    </div>

                                                )}

                                            </div>

                                        )}


                                        {/* Thumbnail badge */}

                                        {mode === "view" && isThumbnail && (

                                            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm flex items-center">

                                                <svg
                                                    className="w-3 h-3 mr-1"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>

                                                Thumbnail

                                            </div>

                                        )}

                                    </div>

                                );

                            })}

                        </div>

                    )}

                </>

            )}

        </div>

    );

};

export default DepartmentGallery;
