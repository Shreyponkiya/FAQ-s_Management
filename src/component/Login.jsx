import React, { useState, useEffect } from "react";
import Signup from "./Signup";
import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [datalist, setDatalist] = useState([]);
  const API_url = "https://server-1-pwpn.onrender.com/user"
  const getdata = async () => {
    try { 
      const response = await axios.get(API_url);
      console.log(response)
      setDatalist(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    getdata();
  }, []);

  const submitHandle = (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please fill in all fields.");
      return;
    }

    if (!datalist || datalist.length === 0) {
      alert("User data not loaded.");
      return;
    }

    const user = datalist.find(
      (data) => data.username === username && data.password === password
    );
    if (user) {
      localStorage.setItem("current_user", user.username);
      if (user.username) {
        window.location.reload();
      }
      console.log("Login successful!");
      alert("Login successful!");
    } else {
      console.log("Invalid username or password.");
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-auto p-6 pt-35">
      <div className="border-2 px-22 py-21 bg-blue-100 ">
        <h1 className="font text-center pb-8 text-4xl font-bold font-sans items-center">
          Login
        </h1>
        <form>
          <div>
            <label htmlFor="username" className="font-semibold text-2xl">
              UserName:
            </label>
            <input
              className="border-1 text-balance p-1 pl-3 text-2xl mb-2 ml-2"
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Enter User Name"
              id="username"
              name="username"
              value={username}
            />
          </div>

          <div>
            <label htmlFor="password" className="font-semibold text-2xl">
              Password:
            </label>
            <input
              className="border-1 text-balance p-1 pl-3 text-2xl mb-2 ml-4"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter Password"
              id="password"
              name="password"
              value={password}
            />
          </div>

          <div className="flex justify-between pt-5">
            <button
              className="border-1 bg-blue-500 px-15 py-3 text-2xl rounded font-semibold hover:bg-blue-600"
              onClick={submitHandle}
            >
              Submit
            </button>
            <button
              className="border-1 bg-blue-500 px-15 py-3 text-2xl rounded font-semibold hover:bg-blue-600"
              type="reset"
              onClick={() => {
                setUsername("");
                setPassword("");
              }}
            >
              Reset
            </button>
          </div>
          <p className="text-2xl pt-3 font-medium">
            Don't have an account?{" "}
            <Link to="/signup">Signup</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
