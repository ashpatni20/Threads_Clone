import { FaRegUser } from "react-icons/fa6";
import { useContext, useEffect, useState } from "react";
import { ThreadContext } from "../main";
import { BASE_URL } from "../utils/common";
import apiClient from "../utils/apiClient";
import { useNavigate } from "react-router-dom";

const Post = ({ data }) => {
  const { currUser } = useContext(ThreadContext);
  const loggedInUser = currUser?.userId;
  console.log(data);
  const { createdAt, description, _id, user, likeCount, likes } = data;
  const [postliked, setPostliked] = useState(false);
  const [likeCountState, setLikeCountState] = useState(likeCount);
  const navigate = useNavigate();

  useEffect(() => {
    for (let i = 0; i < likes.length; i++) {
      if (likes[i] === loggedInUser) {
        setPostliked(true);
        break;
      }
    }
  }, []);

  const handleLike = () => {
    if (postliked) {
      apiClient
        .post(`${BASE_URL}posts/unlikePost`, { postId: _id })
        .then((res) => {
          console.log(res);
          setPostliked(false);
          setLikeCountState(likeCountState - 1);
        });
    } else {
      apiClient
        .post(`${BASE_URL}posts/likePost`, { postId: _id })
        .then((res) => {
          console.log(res);
          setPostliked(true);
          setLikeCountState(likeCountState + 1);
        });
    }
  };

  const goToProfile = () => {
    navigate(`/profile/${data?.user?._id}`);
  };
  return (
    <div>
      <div className="py-4 border-b border-gray-700">
        <div className="px-4">
          <div className="flex items-center mb-2">
          <div className="min-w-fit ">
        {user?.avatar && (
          <img
            src={user?.avatar}
            alt="avatar"
            className="w-[40px] h-[40px] rounded-full object-cover"
          />
        )}
      </div>

            <div className="ml-4 cursor-pointer" onClick={goToProfile}>
              <p>
                {user.userName}{" "}
                <span className="text-gray-500">{createdAt?.slice(0, 10)}</span>
              </p>
            </div>
          </div>
          <p className="mb-2">{description}</p>
          {data?.image && (
          <img
            src={data?.image}
            loading="lazy"
            alt="post"
            className="max-w-[400px] max-h-[500px] rounded-md"
          />
        )}
          <div className="flex gap-4 text-gray-500">
            <span onClick={handleLike}>
              {" "}
              {postliked ? (
                <i className="fa-sharp fa-solid fa-heart text-[red] text-xl"></i>
              ) : (
                <i className="fa-sharp fa-regular fa-heart text-[red] text-xl font-thin"></i>
              )}
               {" "}{likeCountState}
            </span>
            <span>💬 </span>
            <span>🔄 </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
