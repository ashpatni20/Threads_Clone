import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import apiClient from '../utils/apiClient';

const EditProfile = ({ userData, onClose, setPageRefresh }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        bio: userData.bio || "",
        website: userData.website || "",
        location: userData.location || "",
        avatar: userData.avatar || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, avatar: file });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });

        try {
            const response = await apiClient.post("/users/update", formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast(response.data.message || "Profile updated successfully!");
            onClose();
            setPageRefresh((prev) => !prev);
        } catch (error) {
            console.error(error);
            toast.error("Error updating profile");
        } finally {
            setLoading(false);
            onClose();
        }
    };

    return (
        <>
            {/* <button
                onClick={() => setIsOpen(true)}
                className="editpro w-full border border-gray-700 text-center m-2 rounded-md p-1"
            >
            
            </button> */}

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-85 flex justify-center items-center z-50">
                    <div className="bg-zinc-900 updateprofile p-6 rounded-xl shadow-lg w-4/5 md:w-3/5 lg:w-2/5 xl:w-1/3 border">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-white text-2xl">Edit Profile</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-400 text-sm mb-2" htmlFor="bio">
                                    Bio
                                </label>
                                <textarea
                                    className="w-full p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    id="bio"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    maxLength="200"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-400 text-sm mb-2" htmlFor="website">
                                    Website
                                </label>
                                <input
                                    className="w-full p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    id="website"
                                    type="text"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-400 text-sm mb-2" htmlFor="location">
                                    Location
                                </label>
                                <input
                                    className="w-full p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    id="location"
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-400 text-sm mb-2" htmlFor="avatar">
                                    Avatar
                                </label>
                                <input
                                    className="w-full p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    id="avatar"
                                    type="file"
                                    name="avatar"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    className="w-full p-4 bg-white text-black font-bold rounded-lg hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {loading ? <span className="loader"></span> : <span>Save</span>}
                                </button>
                            </div>
                        </form>
                        <Toaster
                            toastOptions={{
                                className: "",
                                style: {
                                    border: "1px solid #1d9bf0",
                                    padding: "10px 30px",
                                    fontSize: "16px",
                                    fontWeight: "500",
                                    borderRadius: "50px",
                                    background: "#1d9bf0",
                                    color: "white",
                                },
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default EditProfile;
