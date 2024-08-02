import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import apiClient from "../utils/apiClient";
import Editprofile from "./EditProfile";
import { ThreadContext } from "../main";
// import { PiHeartThin } from "react-icons/pi";
// import { HiOutlineChatBubbleOvalLeft } from "react-icons/hi2";
// import { TbSend } from "react-icons/tb";
// import { BiRepost } from "react-icons/bi";
import Post from "./Post";
import Modal from "./Modal";

const User = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currUser } = useContext(ThreadContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageRefresh, setPageRefresh] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (id) {
      apiClient
        .get(`/users/getProfile?id=${id}`)
        .then((res) => {
          setUserData(res.data.data.user);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
  }, [id, pageRefresh]);

  const handleFollow = () => {
    apiClient
      .get(`/users/follow?id=${id}`)
      .then((res) => {
        setPageRefresh(!pageRefresh);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleUnfollow = () => {
    apiClient
      .get(`/users/unFollow?id=${id}`)
      .then((res) => {
        setPageRefresh(!pageRefresh);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  if (loading) return <div>Loading...</div>;

  if (!userData) return <div>User not found</div>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#101010] text-white p-2">
      <h1 className="mt-4">Profile</h1>
      <div className="flex justify-center items-center flex-grow w-full">
        <main className="w-full max-w-lg bg-[#181818] rounded-lg p-4 border border-gray-700">
          <section className="mb-6 m-2">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-2 max-w-[60%]">
                <div>
                  <h1 className="text-2xl font-bold tracking-wider p-2">{userData.userName}</h1>
                  <span className="lowercase p-2">{userData.email}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="bio p-2">{userData.bio}</p>
                  <div className="flex gap-4 p-2">
                    <span>{userData.followers.length} followers</span>
                    <span>{userData.following.length} following</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end p-4">
                <img className="w-[150px] h-[150px] rounded-full object-cover" src={userData.avatar} alt="" />
              </div>
            </div>

            <div className="ml-1">
            {currUser?.userId === id ? (
              <button disabled className="w-[150px] h-[40px] bg-[#101010] rounded-md">
                {" "}
                {userData.followers.length} Followers
              </button>
            ) : (
              <div className="flex gap-4">
                <button className="w-[150px] rounded-md h-[40px] bg-[#101010]" onClick={handleFollow}>
                  Follow
                </button>

                <button className="w-[150px] rounded-md h-[40px] bg-[#101010]" onClick={handleUnfollow}>
                  Unfollow
                </button>
              </div>
            )}
            </div>

            {currUser?.userId === id && !loading &&(
                <button
                onClick={handleModalOpen}   
                className="editpro w-full border border-gray-700 text-center m-2 rounded-md p-1"
            >
                Edit Profile
            </button>
      )}


            <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <Editprofile userData={userData} onClose={handleModalClose} setPageRefresh={setPageRefresh}/>
      </Modal>


            {/* {currUser?.userId === id && (
              <Editprofile userid={userData._id} />
            )} */}
            {currUser?.userId !== id && (
              <div className="flex gap-4">
                <button className="w-[150px] h-[40px] bg-[#1DA1F2]" onClick={handleFollow}>
                  Follow
                </button>
                <button className="w-[150px] h-[40px] bg-[#1DA1F2]" onClick={handleUnfollow}>
                  Unfollow
                </button>
              </div>
            )}
          </section>

          <section>
            <h1 className="text-xl font-bold mb-4">Threads</h1>
            <hr className="mb-4" />
            {userData.posts.length > 0 ? (
              <div className="flex flex-col gap-4">
                {userData.posts.map((ele, index) => (

                    <Post key={ele._id} data={ele} />
                
                ))}
              </div>
            ) : (
              <div className="min-h">
                <h1>Write some threads....</h1>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default User;


  {/* <div key={index} className="flex gap-2 border-b border-gray-700 pb-2">
                    <img className="w-10 h-10 rounded-full" src={userData.avatar} alt="" />
                    <div className="flex flex-col gap-2 w-full">
                      <Link to={`/post/${post._id}`}>
                        <div>
                          <h3 className="font-bold lowercase">{userData.userName}</h3>
                          <p className="font-thin">{post.description}</p>
                          {post.image && <img src={post.image} alt="" className="w-full h-auto mt-2" />}
                        </div>
                      </Link>
                      <div className="flex gap-4 text-xl">
                        <button className="flex items-center gap-1">
                          <PiHeartThin />
                          <span>{post.likes.length}</span>
                        </button>
                        <button className="flex items-center">
                          <HiOutlineChatBubbleOvalLeft />
                        </button>
                        <button className="flex items-center text-2xl">
                          <BiRepost />
                        </button>
                        <button className="flex items-center">
                          <TbSend />
                        </button>
                      </div>
                    </div>
                  </div> */}