import loginimg from "../assets/jxB9GUOHTf2.webp";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import { BASE_URL } from "../utils/common";
import { ThreadContext } from "../main";

const Login = () => {
  const { currUser, setCurrUser } = useContext(ThreadContext);

  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      navigate("/home");
    }
  }, []);

  const handleLogin = () => {
    if (!data.email?.trim() || !data.password) {
      toast("All fields are required");
      return;
    }

    setLoading(true);

    axios
      .post(`${BASE_URL}users/login`, data)
      .then((res) => {
        console.log(res);
        setCurrUser(res.data);
        toast(res.data.mesage);
        setData({
          email: "",
          password: "",
        });

        Cookies.set("token", res.data.token, { expires: 1 });
        navigate("/home");
      })
      .catch((err) => {
        console.log(err);
        // toast("Something went wrong");
        toast("Check your credentials");
      })
      .finally(() => setLoading(false));
  };
  return (
    <div className="relative h-screen overflow-hidden bg-[#101010]">
      <img
        src={loginimg}
        className="absolute top-0 left-0 w-full h-1/2 object-cover z-0"
        alt="login background"
      />
      <main className="relative z-10 bg-[#101010] bg-opacity-75 h-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-6 w-full max-w-md">
          <div className="flex flex-col w-full gap-4 text-center">
            <h2 className="text-white font-bold">Log into your account</h2>
            <div className="form flex flex-col gap-2">
              <input
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                type="text"
                placeholder="Email"
                className="p-2 rounded bg-gray-800 text-white"
              />
              <input
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                type="password"
                placeholder="Password"
                className="p-2 rounded bg-gray-800 text-white"
              />
              <button
                className="p-2 rounded bg-gray-600 text-white font-bold hover:bg-gray-700"
                onClick={() => handleLogin()}
              >
                Log in
              </button>
            </div>
          </div>
          <div className="text-white">
            Don't have an ID yet?{" "}
            <span
              className="text-gray-500 cursor-pointer "
              onClick={() => navigate("/signup")}
            >
              Create one
            </span>
          </div>
        </div>
      </main>
      <Toaster
        toastOptions={{
          className: "",
          style: {
            padding: "10px 30px",
            fontSize: "16px",
            fontWeight: "500",
            // borderRadius: "50px",
            background: " #101010",
            color: "white",
          },
        }}
      />
    </div>
  );
};

export default Login;
