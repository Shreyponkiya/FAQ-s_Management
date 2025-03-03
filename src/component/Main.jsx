import React, { useState, useContext, useEffect } from "react";
import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import About from "./About";
import UserList from "./User";
import Forget_passowrd from "./Forget_password";
import FaqPage from "./FaqPage";
import NotFoundPage from "./NotFoundPage";
import { LanguageContext, LanguageProvider } from "../context/LanguageContext";
import "../App.css";
import i18n from "../i18n/i18n"; // Import i18n
const Main = () => {
  const [loading, setLoading] = useState(false);
  const { language, changeLanguage } = useContext(LanguageContext); // Use contex
  const isLoggedIn = false;
  const currentusername = localStorage.getItem("current_user");

  const logout = () => {
    try {
      localStorage.removeItem("current_user");
      setLoading(true);
      window.location.reload();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  addEventListener("load",()=>{
    changeLanguage("en")
  })
  return (
    <Router>
      <div>
        <nav className="bg-blue-500 rounded p-3">
          <ul className="flex gap-9 p-4 pl-10 ">
            <li className="list-none text-2xl font-bold hover:scale-80 transition-all  tracking-wider text-white">
              <Link to="/">Home</Link>
            </li>
            <li className="list-none text-2xl font-bold hover:scale-80 transition-all tracking-wider text-white">
              <Link to="/about">About</Link>
            </li>
            {currentusername ? (
              <div className="flex text-right">
                <li
                  className="list-none text-2xl font-bold hover:scale-80 transition-all tracking-wider text-white "
                  onClick={logout}
                >
                  <Link to="/">Logout</Link>
                </li>
              </div>
            ) : null}
          </ul>
        </nav>
        <Routes>
          <Route
            path="/"
            element={currentusername ? <UserList /> : <Login />}
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forget_password" element={<Forget_passowrd />} />
          <Route path="/about" element={<About />} />
          <Route path="/faqs" element={<FaqPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <div className="flex justify-end absolute top-[20%] right-[5%] mb-4">
        <select
          onChange={(e) => changeLanguage(e.target.value)}
          value={language}
          className="border-2 p-2 rounded-lg"
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
      </div>
    </Router>
  );
};

export default Main;
