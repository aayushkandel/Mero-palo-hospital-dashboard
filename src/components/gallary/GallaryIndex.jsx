// src/HospitalGallery.jsx

import React, { useState, useEffect, useRef } from 'react';

import {
    updateHospitalThumbnail,
    getHospitalThumbnail,
    getHospitalGallaryImages,
    uploadHospitalGallary,
    deleteHospitalGallaryImages
} from '../../api/FetchApi';


const UPLOADS_BASE_URL =
    import.meta.env.VITE_UPLOADS_BASE_URL || "http://localhost:8000";


const getImageUrl = (imagePath) => {
    if (!imagePath) return "";

    if (imagePath.startsWith("http")) {
        return imagePath;
    }

    // Your backend currently saves paths like:
    // uploads/hospital_gallery/image.webp

    const cleanPath = imagePath
        .replace(/^\/+/, "")
        .replace(/^uploads\//, "");

    return `${UPLOADS_BASE_URL}/uploads/${cleanPath}`;
};


const GalleryIndex = () => {

    const [images, setImages] = useState([]);

    // Modes: 'view', 'selectThumbnail', 'selectDelete'
    const [mode, setMode] = useState('view');

    const [thumbnailId, setThumbnailId] = useState(null);

    const [selectedForDelete, setSelectedForDelete] = useState([]);

    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);


    // --- Fetch Gallery and Thumbnail --- //

    const fetchGalleryData = async () => {

        try {

            setLoading(true);

            const [galleryResponse, thumbnailResponse] = await Promise.all([
                getHospitalGallaryImages(),
                getHospitalThumbnail().catch(() => null)
            ]);

            const galleryImages = galleryResponse.data.images || [];

            const formattedImages = galleryImages.map((image) => ({
                id: image.id,
                url: getImageUrl(image.image),
                name: image.dguid,
                imagePath: image.image
            }));

            setImages(formattedImages);


            // Find which gallery image is currently selected as thumbnail

            const currentThumbnail =
                thumbnailResponse?.data?.thumbnail || null;

            const selectedThumbnail = galleryImages.find(
                (image) => image.image === currentThumbnail
            );

            setThumbnailId(selectedThumbnail?.id || null);


        } catch (error) {

            console.error("Error fetching gallery:", error);

            alert(
                error.response?.data?.detail ||
                "Unable to load hospital gallery"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {
        fetchGalleryData();
    }, []);


    // --- Add Images --- //

    const handleAddImage = () => {

        fileInputRef.current?.click();

    };


    const handleImageUpload = async (event) => {

        const files = Array.from(event.target.files || []);

        if (files.length === 0) return;

        const formData = new FormData();

        files.forEach((file) => {
            formData.append("files", file);
        });

        try {

            setLoading(true);

            await uploadHospitalGallary(formData);

            await fetchGalleryData();

            alert("Images uploaded successfully");

        } catch (error) {

            console.error("Error uploading images:", error);

            alert(
                error.response?.data?.detail ||
                "Unable to upload images"
            );

        } finally {

            setLoading(false);

            // Allows selecting the same file again
            event.target.value = "";

        }

    };


    // --- Select Thumbnail --- //

    const handleSelectThumbnail = (id) => {

        setThumbnailId(id);

    };


    const handleSaveThumbnail = async () => {

        if (!thumbnailId) {
            alert("Please select an image first");
            return;
        }

        try {

            setLoading(true);

            // Send existing gallery image ID.
            // No new image is uploaded here.

            await updateHospitalThumbnail(thumbnailId);

            setMode('view');

            await fetchGalleryData();

            alert("Thumbnail updated successfully");

        } catch (error) {

            console.error("Error updating thumbnail:", error);

            alert(
                error.response?.data?.detail ||
                "Unable to update thumbnail"
            );

        } finally {

            setLoading(false);

        }

    };


    // --- Select Images for Delete --- //

    const handleSelectForDelete = (id) => {

        if (selectedForDelete.includes(id)) {

            setSelectedForDelete(
                selectedForDelete.filter(item => item !== id)
            );

        } else {

            setSelectedForDelete([
                ...selectedForDelete,
                id
            ]);

        }

    };


    // --- Confirm Delete --- //

    const confirmDelete = async () => {

        if (selectedForDelete.length === 0) return;

        try {

            setLoading(true);

            await Promise.all(
                selectedForDelete.map((id) =>
                    deleteHospitalGallaryImages(id)
                )
            );

            setSelectedForDelete([]);

            setMode('view');

            await fetchGalleryData();

            alert("Selected images deleted successfully");

        } catch (error) {

            console.error("Error deleting images:", error);

            alert(
                error.response?.data?.detail ||
                "Unable to delete selected images"
            );

        } finally {

            setLoading(false);

        }

    };


    // --- Cancel Selection Mode --- //

    const cancelMode = () => {

        setMode('view');

        setSelectedForDelete([]);

        fetchGalleryData();

    };


    const selectedThumbnailData = images.find(
        img => img.id === thumbnailId
    );


    return (

        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">

            {/* Hidden file input for Add Images */}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                hidden
                onChange={handleImageUpload}
            />


            {/* Top Bar Controls */}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">

                <div>

                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        Hospital Gallery
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Manage photos and thumbnail
                    </p>

                </div>


                <div className="flex flex-wrap items-center gap-3">

                    {/* Always visible Add Button */}

                    <button
                        onClick={handleAddImage}
                        disabled={loading}
                        className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
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

                        Add Images

                    </button>


                    {/* Conditional Buttons */}

                    {images.length > 0 && mode === 'view' && (

                        <>

                            <button
                                onClick={() => setMode('selectThumbnail')}
                                className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                            >
                                Set Thumbnail Image
                            </button>


                            <button
                                onClick={() => setMode('selectDelete')}
                                className="flex items-center px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 text-sm font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                            >
                                Delete
                            </button>

                        </>

                    )}


                    {/* Cancel button */}

                    {mode !== 'view' && (

                        <button
                            onClick={cancelMode}
                            className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>

                    )}

                </div>

            </div>


            {/* Thumbnail Display Field */}

            {mode === 'selectThumbnail' && (

                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between">

                    <div>

                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            Selected Thumbnail
                        </h3>

                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            This will be the main cover image for the hospital.
                        </p>

                    </div>


                    {selectedThumbnailData ? (

                        <div className="flex items-center space-x-3">

                            <img
                                src={selectedThumbnailData.url}
                                alt="Selected"
                                className="w-16 h-16 object-cover rounded-md shadow-sm border border-gray-300 dark:border-gray-600"
                            />


                            <button
                                onClick={handleSaveThumbnail}
                                disabled={loading}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                            >
                                Save Thumbnail
                            </button>

                        </div>

                    ) : (

                        <span className="text-sm text-gray-400 dark:text-gray-500 italic">
                            No image selected yet
                        </span>

                    )}

                </div>

            )}


            {/* Delete Action Bar */}

            {mode === 'selectDelete' && (

                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-between">

                    <div>

                        <h3 className="text-sm font-semibold text-red-800 dark:text-red-400">
                            Delete Images
                        </h3>

                        <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                            {selectedForDelete.length} image(s) selected for deletion.
                        </p>

                    </div>


                    <button
                        onClick={confirmDelete}
                        disabled={selectedForDelete.length === 0 || loading}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm ${
                            selectedForDelete.length > 0
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-red-300 dark:bg-red-800/50 text-red-500 dark:text-red-400 cursor-not-allowed'
                        }`}
                    >
                        Confirm Delete
                    </button>

                </div>

            )}


            {/* Image Grid */}

            {loading && images.length === 0 ? (

                <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                    Loading images...
                </div>

            ) : images.length === 0 ? (

                <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                    No images uploaded yet. Click "Add Images" to start.
                </div>

            ) : (

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                    {images.map((image) => {

                        const isThumbnail = thumbnailId === image.id;

                        const isSelectedForDelete =
                            selectedForDelete.includes(image.id);


                        return (

                            <div
                                key={image.id}
                                className={`relative group rounded-xl overflow-hidden border-2 transition-all duration-200 aspect-square
                                    ${isThumbnail ? 'border-green-500 shadow-md' : 'border-transparent'}
                                    ${isSelectedForDelete ? 'border-red-500 opacity-75' : ''}
                                `}
                            >

                                <img
                                    src={image.url}
                                    alt={image.name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />


                                {/* Overlay for selection modes */}

                                {mode !== 'view' && (

                                    <div
                                        className="absolute inset-0 bg-black/30 cursor-pointer flex items-start justify-end p-2"
                                        onClick={() => {

                                            if (mode === 'selectThumbnail') {
                                                handleSelectThumbnail(image.id);
                                            }

                                            if (mode === 'selectDelete') {
                                                handleSelectForDelete(image.id);
                                            }

                                        }}
                                    >

                                        {/* Thumbnail Selection Circle */}

                                        {mode === 'selectThumbnail' && (

                                            <div
                                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                                                    ${isThumbnail ? 'bg-green-500 border-green-500' : 'bg-white/80 border-gray-400'}
                                                `}
                                            >

                                                {isThumbnail && (

                                                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>

                                                )}

                                            </div>

                                        )}


                                        {/* Delete Checkbox */}

                                        {mode === 'selectDelete' && (

                                            <div
                                                className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors
                                                    ${isSelectedForDelete ? 'bg-red-500 border-red-500' : 'bg-white/80 border-gray-400'}
                                                `}
                                            >

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


                                {/* Thumbnail Badge */}

                                {mode === 'view' && isThumbnail && (

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

        </div>

    );

};


export default GalleryIndex;