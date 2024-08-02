import logo from "../assets/light-logo.svg";
import { GoHome } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa6";
import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThreadContext } from "../main";
import apiClient from "../utils/apiClient";
import Cookies from 'js-cookie'; // Ensure this is imported

const Header = () => {
  const navigate = useNavigate();
  const { currUser } = useContext(ThreadContext);
  const loggedInUser = currUser?.userId;

  const goToProfile = () => {
    navigate(`/profile/${loggedInUser}`);
  };

  const handleLogout = async () => {
    try {
      const res = await apiClient.get(`/users/logout`);
      console.log(res);
      Cookies.remove("token");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  };

  return (
    <div className="bg-[#101010] w-20 h-screen fixed top-0 left-0 flex flex-col items-center justify-between py-6">
      <div className="flex flex-col items-center space-y-4">
        <img src={logo} alt="Logo" className="w-10" />
      </div>
      <div className="text-[#777777] flex flex-col items-center space-y-10">
        <GoHome className="text-4xl cursor-pointer hover:text-white" onClick={() => navigate("/home")} />
        <FiSearch className="text-4xl cursor-pointer hover:text-white" />
        <FaRegUser className="text-4xl cursor-pointer hover:text-white" onClick={goToProfile} />
      </div>
      <div className="text-[#777777] flex flex-col items-center space-y-4" >
        <IoLogOutOutline className="text-4xl cursor-pointer hover:text-white" onClick={()=>handleLogout()} />
      </div>
    </div>
  );
};

export default Header;
