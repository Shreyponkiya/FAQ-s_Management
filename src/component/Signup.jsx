import React, { useState, useEffect } from "react";
import axios from "axios";
import { useFormik } from "formik";
import { Yup_schema } from "../schema/Yup_schema";
import { nanoid } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [data, setData] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const navigate = useNavigate();
  const API_url = "https://api-new-git-main-shreyponkiyas-projects.vercel.app/";
  const initialValues = {
    username: "",
    email: "",
    password: "",
  };

  const {
    values,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
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
      alert("Please fill in all fields.");
      return;
    }

    try {
      await axios.post(API_url, {
        id: nanoid(),
        username: values.username,
        email: values.email,
        password: values.password,
      });
      handleApi();
      resetForm();
      navigate("/");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const submitUpdate = async (values) => {
    if (!values.username || !values.email || !values.password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await axios.put(`${API_url}${editingUser.id}`, {
        username: values.username,
        email: values.email,
        password: values.password,
      });
      handleApi();
      setEditingUser(null);
      resetForm();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleApi = async () => {
    try {
      const response = await axios.get(API_url);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_url}${id}`);
      handleApi();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    values.username = user.username;
    values.email = user.email;
    values.password = user.password;
  };

  const handleReset = () => {
    resetForm();
    setEditingUser(null);
  };

  useEffect(() => {
    handleApi();
  }, []);

  return (
    <>
      <div className="w-full h-auto justify-center items-center flex m-3 pt-30">
        <div className="border-2 px-15 py-15 bg-blue-100">

          <h1 className="font text-center pb-8 text-4xl font-bold font-sans items-center">
            {editingUser ? "Edit User" : "SignUp"}
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="flex justify-center items-center p-8 ">
              <div className="">
                <div className="justify-between flex">
                  <label htmlFor="username" className="font-semibold text-2xl">
                    UserName :{" "}
                  </label>
                  <input
                    className="border-1 text-balance p-1 pl-3 text-2xl mb-2 ml-3 justify-end"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="text"
                    placeholder="Enter User Name"
                    id="username"
                    name="username"
                    value={values.username}
                  />
                  {errors.username && touched.username && (
                    <p className="error">{errors.username}</p>
                  )}
                </div>
                <div>
                  <label className="font-semibold text-2xl" htmlFor="email">
                    Email :{" "}
                  </label>
                  <input
                    className="border-1 text-balance p-1 pl-3 text-2xl mb-2 ml-16"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="email"
                    placeholder="Enter Email Id"
                    id="email"
                    name="email"
                    value={values.email}
                  />
                  {errors.email && touched.email && (
                    <p className="error">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="password" className="font-semibold text-2xl">
                    Password :{" "}
                  </label>
                  <input
                    className="border-1 text-balance p-1 pl-3 text-2xl mb-2 ml-5"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="password"
                    placeholder="Enter Password"
                    id="password"
                    name="password"
                    value={values.password}
                  />
                  {errors.password && touched.password && (
                    <p className="error">{errors.password}</p>
                  )}
                </div>
                <div className="flex justify-between pt-5">
                  <div>
                    <button
                      className="border-1 bg-blue-500 px-15 py-3 text-2xl rounded font-semibold hover:bg-blue-600"
                      type="submit"
                    >
                      {editingUser ? "Update" : "Submit"}
                    </button>
                  </div>
                  <div>
                    <button
                      className="border-1 bg-blue-500 px-15 py-3 text-2xl rounded font-semibold hover:bg-blue-600"
                      type="button"
                      onClick={handleReset}
                    >
                      Reset
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
