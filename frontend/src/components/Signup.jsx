import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { BASE_URL } from "../utils/common";
import axios from "axios";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
const Signup = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      navigate("/allPosts");
    }
  }, []);

  const handleSignUp = () => {
    if (!data.userName?.trim() || !data.email?.trim() || !data.password) {
      toast("All fields are required");
      return;
    }

    setLoading(true);
    console.log(data);

    axios
      .post(`${BASE_URL}users/signup`, data)
      .then((res) => {
        console.log(res.data.message);
        toast(res.data.message);
        setData({
          userName: "",
          email: "",
          password: "",
        });
        navigate("/");
      })
      .catch((err) => {
        toast(err.message);
      })
      .finally(() => setLoading(false));
  };
  return (
    <div className="signuppage bg-[#101010] min-h-screen flex items-center justify-center text-white">
      <main className="w-full max-w-lg p-8 bg-gray-900 rounded shadow-md flex flex-col items-center gap-4">
        <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>

        <div className="w-full">
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
                htmlFor="full_name"
              >
                Full Name
              </label>
              <input
                className="appearance-none block w-full bg-gray-800 text-gray-300 border border-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-gray-700"
                id="full_name"
                type="text"
                placeholder="Full Name"
              />
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                className="appearance-none block w-full bg-gray-800 text-gray-300 border border-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-gray-700"
                id="username"
                type="text"
                placeholder="Username"
                value={data.username}
                onChange={(e) => setData({ ...data, userName: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="appearance-none block w-full bg-gray-800 text-gray-300 border border-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-gray-700"
                id="password"
                type="password"
                placeholder="Password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="appearance-none block w-full bg-gray-800 text-gray-300 border border-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-gray-700"
                id="email"
                type="email"
                placeholder="Email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>
          </div>

          <button
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-4 px-4 rounded-2xl w-full transition-colors duration-200"
            onClick={handleSignUp}
            disabled={loading}
          >
            Sign Up
          </button>
        </div>

        <p className="mt-4">
          Already have an account?{" "}
          <span
            className="text-gray-400 hover:underline"
            onClick={() => navigate("/")}
          >
            Log in
          </span>
        </p>
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

export default Signup;
