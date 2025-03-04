import React, { useState, useEffect } from "react";
import axios from "axios";
import { useFormik } from "formik";
import { Yup_schema } from "../schema/Yup_schema";
import { useNavigate } from "react-router-dom";
const Forget_password = () => {
  const [data, setData] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [id, setid] = useState("");
  const navigate = useNavigate();
  const API_url = "https://faq-s-management-server-13.onrender.com/user";
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
      const user = data.find((user) => user.email === values.email);
      if (user) {
        setid(user._id);
        if (values.old_password !== user.password) {
          alert("Your old password is incorrect!");
          return;
        }
        if (
          values.new_password === user.password1 ||
          values.new_password === user.password2 ||
          values.new_password === user.password3
        ) {
          alert("Your new password matches an old password!");
          return;
        }
        try {
          await axios.put(`${API_url}/update/${user._id}`, {
            username: user.username,
            email: values.email,
            password: values.new_password,
            password1: user.password2,
            password2: user.password3,
            password3: values.old_password,
          });
          setEditingUser(null);
          resetForm();
          navigate("/");
        } catch (error) {
          console.error("Error updating user:", error);
        }
      }
      return;
    }
  };

  const submitUpdate = async (values) => {
    if (!values.username || !values.email || !values.password) {
      alert("Please fill in all fields.");
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

  const handlecheck_password = () => {};

  const handleReset = () => {
    resetForm();
    setEditingUser(null);
  };

  useEffect(() => {
    handleApi();
    handlecheck_password();
  }, []);

  return (
    <>
      <div className="w-full h-auto justify-center items-center flex m-3 pt-30">
        <div className="border-2 px-15 py-15 bg-blue-100">
          <h1 className="font text-center pb-8 text-4xl font-bold font-sans items-center">
            Forgot_Password
          </h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("🛠️ Form submission triggered");
              handleSubmit();
            }}
          >
            <div className="flex justify-center items-center p-8 ">
              <div className="">
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
                </div>
                <div>
                  <label htmlFor="password" className="font-semibold text-2xl">
                    Current Password :{" "}
                  </label>
                  <input
                    className="border-1 text-balance p-1 pl-3 text-2xl mb-2 ml-5"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="password"
                    placeholder="Enter Your Old Password"
                    id="old_password"
                    name="old_password"
                    value={values.old_password}
                  />
                </div>
                <div>
                  <label
                    htmlFor="new_password"
                    className="font-semibold text-2xl"
                  >
                    Password :{" "}
                  </label>
                  <input
                    className="border-1 text-balance p-1 pl-3 text-2xl mb-2 ml-5"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="password"
                    placeholder="Enter Your New Password"
                    id="new_password"
                    name="new_password"
                    value={values.new_password}
                  />
                </div>
                <div className="flex justify-between pt-5">
                  <div>
                    <button
                      type="submit"
                      className="border-1 bg-blue-500 px-15 py-3 text-2xl rounded font-semibold hover:bg-blue-600"
                    >
                      Submit
                    </button>
                  </div>
                  <div>
                    <button
                      className="border-1 bg-blue-500 px-15 py-3 text-2xl rounded font-semibold hover:bg-blue-600"
                      type="reset"
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
export default Forget_password;
