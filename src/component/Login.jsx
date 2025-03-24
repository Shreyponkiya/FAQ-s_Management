import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/i18n"; // Ensure correct import

const Login = () => {
  const { t } = useTranslation(); // Use translation function
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [datalist, setDatalist] = useState([]);
  const API_url = "https://faq-s-management-server-13.onrender.com/user";

  useEffect(() => {
    const getdata = async () => {
      try {
        const response = await axios.get(API_url);
        setDatalist(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getdata();
    addEventListener("change",()=>{
      i18n.changeLanguage(localStorage.getItem("language"))
    })
    addEventListener("load",()=>{
      i18n.changeLanguage(localStorage.setItem("language","en"))
    })
  }, [localStorage.getItem("language")]);
  const submitHandle = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert(t("fill_all_fields"));
      return;
    }

    const user = datalist.find(
      (data) => data.username === username && data.password === password
    );

    if (!user) {
      alert(t("invalid_credentials"));
      return;
    }

    if (!user.verify) {
      alert(t("verify_email"));
      return;
    }

    localStorage.setItem("current_user", user._id);
    alert(t("login_success"));
    window.location.reload();
  };

  return (
    <div className="flex flex-col justify-center items-center h-auto p-6 pt-20">
      <div className="rounded-2xl px-22 py-10 bg-blue-200 duration-900 shadow-[5px_5px_rgba(0,_98,_90,_0.4),_10px_10px_rgba(0,_98,_90,_0.3)] hover:shadow-[5px_5px_rgba(0,_98,_90,_0.4),_10px_10px_rgba(0,_98,_90,_0.3),_15px_15px_rgba(0,_98,_90,_0.2),_20px_20px_rgba(0,_98,_90,_0.1),_25px_25px_rgba(0,_98,_90,_0.05)]">
        <h1 className="text-center pb-8 mb-2 text-4xl font-bold">
          {t("login_title")}
        </h1>
        <form onSubmit={submitHandle}>
          <div className="flex flex-col">
            <label
              htmlFor="username"
              className="font-semibold text-lg my-2 ml-2"
            >
              {t("username_label")}
            </label>
            <input
              className="border p-1 pl-3 w-[375px] text-2xl rounded-lg"
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder={t("enter_username")}
              id="username"
              name="username"
              value={username}
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="font-semibold text-lg my-2 ml-2"
            >
              {t("password_label")}
            </label>
            <input
              className="border p-1 pl-3 text-2xl rounded-lg"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder={t("enter_password")}
              id="password"
              name="password"
              value={password}
            />
            <div className="flex justify-end text-blue-800 text-sm">
              <Link to="/forget_password">{t("forgot_password")}</Link>
            </div>
          </div>

          <div className="flex justify-between pt-5">
            <button className="border-2 border-black px-10 py-2 text-xl rounded-lg hover:bg-blue-400 hover:text-white">
              {t("submit")}
            </button>
            <button
              className="border-2 border-black px-10 py-2 text-xl rounded-lg hover:bg-blue-400 hover:text-white"
              type="reset"
              onClick={() => {
                setUsername("");
                setPassword("");
              }}
            >
              {t("reset")}
            </button>
          </div>

          <p className="text-lg text-blue-500 pt-3 font-medium">
            {t("no_account")}{" "}
            <Link className="text-lg text-red-500" to="/signup">
              {t("signup")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
