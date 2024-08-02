import { useState, useEffect } from "react";
import { FaRegUser } from "react-icons/fa6";
import PostNewModel from "./PostNewModel";
import apiClient from "../utils/apiClient";
import Post from "./Post";

const HomePostForYou = () => {
  const [showModal, setShowModal] = useState(false);
  // const navigate = useNavigate();

  const [page, setpage] = useState(1);
  const [postData, setPostData] = useState([]);
  const [newPost, setNewPost] = useState(null);
  useEffect(() => {
    apiClient.get(`/posts/allPosts?page=${page}&limit=10`).then((res) => {
      console.log(res.data.posts);
      setPostData(res.data.posts);
    });
  }, [page, newPost]);

  function handleThreadPost() {
    setShowModal(true);
  }

  return (
    <div>
      <h1 className="text-center mb-4 p-2">for you</h1>
      <div className="min-h-screen bg-[#101010] text-white flex justify-center items-center">
        <div className="w-full max-w-xl border-2 border-gray-700 rounded-lg">
          <div
            className="flex justify-between items-center border-b border-gray-700 p-4"
            onClick={handleThreadPost}
          >
            <div className="flex items-center gap-2 p-2">
              <FaRegUser className="w-5 h-5" />
              Start a thread...
            </div>
            <button className="ml-4 py-2 px-4 bg-#101010 border border-gray-700 rounded-lg">
              Post
            </button>
          </div>

          <div>
            {postData.map((post) => (
              <Post key={post._id} data={post} />
            ))}
          </div>
        </div>
      </div>
      <PostNewModel showModal={showModal} setShowModal={setShowModal} setNewPost={setNewPost}/>
    </div>
  );
};

export default HomePostForYou;
