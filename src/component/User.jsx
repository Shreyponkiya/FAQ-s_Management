import React, { useState, useEffect } from "react";
import axios from "axios";
import { useFormik } from "formik";
import { Yup_schema } from "../schema/Yup_schema";
import { nanoid } from "@reduxjs/toolkit";

const User = () => {
  const [data, setData] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const API_url = "https://server-1-pwpn.onrender.com/user";
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
      await axios.put(`${API_url}/${editingUser.id}`, {
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
      await axios.delete(`${API_url}/${id}`);
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
      <div className="w-full h-auto p-8 justify-center items-center flex m-3">
        <div>
          {editingUser ? (
            <div>
              <h1 className="font text-center pb-8 text-3xl font-bold font-sans items-center">
                {/* {editingUser ? "Edit User" : "SignUp"} */}
                Edit User
              </h1>
              <form className="border-2" onSubmit={handleSubmit}>
                <div className="flex justify-center items-center p-8 ">
                  <div>
                    <div>
                      <label
                        htmlFor="username"
                        className="font-semibold text-1 xl"
                      >
                        UserName :{" "}
                      </label>
                      <input
                        className="border-1 text-balance p-1 pl-3 text-1xl mb-2 ml-3"
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
                      <label
                        className="font-semibold text-1 xl"
                        htmlFor="email"
                      >
                        Email :{" "}
                      </label>
                      <input
                        className="border-1 text-balance p-1 pl-3 text-1xl mb-2 ml-12"
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
                      <label
                        htmlFor="password"
                        className="font-semibold text-1 xl"
                      >
                        Password :{" "}
                      </label>
                      <input
                        className="border-1 text-balance p-1 pl-3 text-1xl mb-2 ml-5"
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
                    <div className="flex justify-between">
                      <div>
                        <button
                          className="border-1 bg-blue-500 px-10 py-3 rounded font-semibold"
                          type="submit"
                        >
                          {editingUser ? "Update" : "Submit"}
                        </button>
                      </div>
                      <div>
                        <button
                          className="border-1 bg-blue-500 px-10 py-3 rounded font-semibold"
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
          ) : (
            <h1 className="font text-center pb-8 text-3xl font-bold font-sans items-center">
              Edit User
            </h1>
          )}
          <div className="flex-col pb-8">
            <table border={3} className="border-2">
              <thead>
                <tr className="border-2">
                  <th className="border-2 p-3.5">UserName</th>
                  <th className="border-2 p-3.5">Email</th>
                  <th className="border-2 p-3.5">Password</th>
                  <th className="border-2 p-3.5">Delete</th>
                  <th className="border-2 p-3.5">Edit</th>
                </tr>
              </thead>
              <tbody>
                {data && data.length > 0 ? (
                  data.map((user) => (
                    <tr key={user.id}>
                      <td className="border-2 p-3.5">{user.username}</td>
                      <td className="border-2 p-3.5">{user.email}</td>
                      <td className="border-2 p-3.5">{user.password}</td>
                      <td className="border-2 p-3.5">
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                          Delete
                        </button>
                      </td>
                      <td className="border-2 p-3.5">
                        <button
                          onClick={() => handleEdit(user)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="border-2 p-3.5">
                      No Data Available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default User;