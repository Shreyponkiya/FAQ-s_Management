import React, { useState, useEffect } from "react";
import axios from "axios";
import { useFormik } from "formik";
import SHA256 from "crypto-js/sha256";
import { Yup_schema } from "../schema/Yup_schema";
import { nanoid } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/i18n"; // Ensure correct import
import "./Signup.css";

const Signup = () => {
  const { t } = useTranslation(); // Use translation function
  const [data, setData] = useState([]);
  const [user_category, setuser_category] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const API_url = "http://localhost:4000/user";
  const initialValues = {
    username: "",
    email: "",
    password: "",
  };
  const {
    values,
    errors,
    handleBlur,
    handleSubmit,
    handleChange,
    touched,
    resetForm,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: Yup_schema,
    onSubmit: (values) => {
      if (editingUser) {
        submitUpdate(values);
      } else {
        submitHandle(values);
      }
    },
  });

  const submitHandle = async (values) => {
    if (!values.username || !values.email || !values.password) {
      alert(t("form_submission_error"));
      return;
    }
    try {
      const hash = SHA256(values.email).toString();
      await axios.post(`${API_url}/add`, {
        id: nanoid(),
        username: values.username,
        email: values.email,
        password: values.password,
        category:user_category,
        login_url: `${hash}`,
        password1: "",
        password2: "",
        password3: "",
      });
      handleApi();
      resetForm();
    } catch (error) {
      console.error(t("form_submission_error"), error);
    }
  };

  const submitUpdate = async (values) => {
    if (!values.username || !values.email || !values.password) {
      alert(t("form_submission_error"));
      return;
    }
    try {
      await axios.put(`${API_url}/${editingUser._id}`, {
        username: values.username,
        email: values.email,
        password: values.password,
      });
      handleApi();
      setEditingUser(null);
      resetForm();
    } catch (error) {
      console.error(t("form_submission_error"), error);
    }
  };

  const handleApi = async () => {
    try {
      const response = await axios.get(API_url);
      setData(response.data);
    } catch (error) {
      console.error(t("form_submission_error"), error);
    }
  };

  const handleReset = () => {
    resetForm();
    setEditingUser(null);
  };

  useEffect(() => {
    handleApi();

    addEventListener("change", () => {
      i18n.changeLanguage(localStorage.getItem("language"));
    });
  }, [localStorage.getItem("language")]);

  return (
    <>
      <div className="w-full h-auto justify-center items-center flex m-3 pt-15">
        <div className="rounded-2xl px-22 py-10 bg-blue-200 duration-900 shadow-[5px_5px_rgba(0,_98,_90,_0.4),_10px_10px_rgba(0,_98,_90,_0.3)] hover:shadow-[5px_5px_rgba(0,_98,_90,_0.4),_10px_10px_rgba(0,_98,_90,_0.3),_15px_15px_rgba(0,_98,_90,_0.2),_20px_20px_rgba(0,_98,_90,_0.1),_25px_25px_rgba(0,_98,_90,_0.05)]">
          <h1 className="font text-center pb-8 text-4xl font-bold font-sans items-center">
            {editingUser ? t("edit_user") : t("signup_title")}
          </h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="flex justify-center items-center p-3">
              <div className="">
                <div className="justify-between flex flex-col">
                  <label
                    htmlFor="username"
                    className="font-semibold text-lg ml-2 my-2"
                  >
                    {t("username_label")}:
                  </label>
                  <input
                    className="border-1 bg-white hover:border-2 text-balance p-1 pl-3 text-xl justify-end rounded-lg w-[375px]"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="text"
                    placeholder={t("username_placeholder")}
                    id="username"
                    name="username"
                    value={values.username}
                  />
                  {errors.username && touched.username && (
                    <p className="error">{t("form_error_username")}</p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label
                    className="font-semibold text-lg ml-2 my-2"
                    htmlFor="email"
                  >
                    {t("email_label")}:
                  </label>
                  <input
                    className="border-1 bg-white hover:border-2 text-balance p-1 pl-3 text-xl rounded-lg"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="email"
                    placeholder={t("email_placeholder")}
                    id="email"
                    name="email"
                    value={values.email}
                  />
                  {errors.email && touched.email && (
                    <p className="error">{t("form_error_email")}</p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="password"
                    className="font-semibold text-lg ml-2 my-2"
                  >
                    {t("password_label")}:
                  </label>
                  <input
                    className="border-1 bg-white hover:border-2 text-balance p-1 pl-3 text-xl rounded-lg"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="password"
                    placeholder={t("password_placeholder")}
                    id="password"
                    name="password"
                    value={values.password}
                  />
                  {errors.password && touched.password && (
                    <p className="error">{t("form_error_password")}</p>
                  )}
                </div>
                <div className="flex gap-3 justify-items-start items-baseline my-3 text-lg">
                  <div>
                    <input
                      type="radio"
                      value={"user"}
                      name="radio_btn"
                      id="user"
                      onChange={(e) => setuser_category(false)}
                    />
                    <label htmlFor="user" className="">
                      User
                    </label>
                  </div>
                  <div>
                    <input
                      onChange={(e) => setuser_category(true)}
                      type="radio"
                      value={"admin"}
                      name="radio_btn"
                      id="admin"
                    />
                    <label htmlFor="admin">Admin</label>
                  </div>
                </div>
                <div className="flex justify-between pt-5">
                  <div>
                    <button
                      type="submit"
                      className="border-2 border-black px-10 py-2 text-xl rounded-lg font-semibold hover:bg-blue-400 hover:text-white"
                    >
                      {t("submit_button")}
                    </button>
                  </div>
                  <div>
                    <button
                      className="border-2 border-black px-10 py-2 text-xl rounded-lg font-semibold hover:bg-blue-400 hover:text-white"
                      type="reset"
                      onClick={handleReset}
                    >
                      {t("reset_button")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
