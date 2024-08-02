import React, { useContext, useEffect, useRef, useState } from 'react';
import photo from '../assets/opp.jpg';
import { CiImageOn } from "react-icons/ci";
import toast, { Toaster } from "react-hot-toast";
import { ThreadContext } from "../main";
import apiClient from "../utils/apiClient";

function PostNewModel({ showModal, setShowModal, setNewPost }) {
  const { currUser } = useContext(ThreadContext);
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const currRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   // currRef.current.focus();
  // }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("description", content);
    if (file) {
      formData.append("image", file);
    }

    try {
      const response = await apiClient.post("/posts/createPost", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(response.data.message);
      toast(response.data.message);
      setContent("");
      setFile(null);
      setShowModal(false);
      setNewPost((prev) => !prev);
    } catch (error) {
      setMessage("Error creating post");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 outline-none focus:outline-none">
          <div className="relative w-full max-w-2xl mx-auto my-6">
            <h1 className="text-center p-2 text-white">New Thread</h1>
            <div className="bg-zinc-900 p-6 rounded-lg shadow-lg">
              <form onSubmit={handleSubmit}>
                <div className="flex items-center gap-4 mb-4">
                  <img src={photo} alt="User Avatar" className="rounded-full w-10 h-10" />
                  <input
                    ref={currRef}
                    type="text"
                    placeholder="Start a thread..."
                    className="flex-grow p-2 text-white bg-gray-800 rounded-md placeholder-gray-400 focus:outline-none"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div className="">
                    <button
                      type="button"
                      className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"
                      onClick={() => document.getElementById('fileInput').click()}
                    >
                      {/* <CiImageOn /> */}
                    </button>
                    <div>
              <input
                type="file"
                id="fileInput"
                className="file-input"
                onChange={handleFileChange}
              />
              <label htmlFor="fileInput" className="file-input-label">
                <i className="fa-regular fa-image"></i>
              </label>
            </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Anyone can reply &amp; quote</span>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-semibold text-gray-400 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
                    onClick={() => setShowModal(false)}
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    {loading ? <span className="loader"></span> : <span>Post</span>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
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
    </>
  );
}

export default PostNewModel;
