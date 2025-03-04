import React, { useState, useEffect } from "react";
import axios from "axios";
import { useFormik } from "formik";
import { Yup_schema } from "../schema/Yup_schema";
import { nanoid } from "@reduxjs/toolkit";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";

const User = () => {
  const [data, setData] = useState([]);
  const [isshow, setisshow] = useState(false);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [editingUser, setEditingUser] = useState(null);
  const API_urluser = "https://faq-s-management-server-13.onrender.com/user";
  const API_urlfaq =
    "https://faq-s-management-server-13.onrender.com/faqcategory";
  const initialValues = {
    category: "",
    createdBy: "",
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
    onSubmit: async (values) => {
      setLoading(true);
      try {
        if (editingUser) {
          await submitUpdate(values);
        } else {
          await submitHandle(values);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
  });

  const submitHandle = async (values) => {
    if (!values.category) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      await axios.post(`${API_urlfaq}/add`, {
        id: nanoid(),
        category: values.category,
        createdBy: localStorage.getItem("current_user"),
      });
      handleApi();
      resetForm();
      setLoading(true);
      window.location.reload();
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFaqRedirect = async(category) => {
    // await axios.post(API_urlfaq,{
    //   category:category
    // })
    navigate(`/faqs?category=${encodeURIComponent(category)}`)
    // const url = `/faqs?category=${encodeURIComponent(category)}`;
    // window.open(url, "_blank");
  };

  const submitUpdate = async (values) => {
    if (!values.username || !values.email || !values.password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await axios.put(`${API_urlfaq}/update/${editingUser._id}`, {
        category: values.category,
      });
      handleApi();
      setEditingUser(null);
      resetForm();
      setLoading(true);
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApi = async () => {
    try {
      const response = await axios.get(API_urluser);
      setData(response.data);
      setLoading(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const handlecategory_data = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_urlfaq);
      setCategory(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    console.log("id  : ", id);
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!isConfirmed) return;
    setLoading(true);
    try {
      await axios.delete(`${API_urlfaq}/delete/${id}`);
      handleApi();
      window.location.reload();
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleApi();
    handlecategory_data();
    const get_user = async () => {
      const data = await axios.get(API_urluser);

      const user_data = data.data.filter(
        (user) => user._id === localStorage.getItem("current_user")
      );
      setisshow(user_data);
    };
    get_user();
  }, []);
  return (
    <>
      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <div>
          <div className="w-full h-auto p-8 justify-center items-center flex flex-col m-3">
            {isshow.length > 0 && isshow[0].category && (
              <form action="" onSubmit={handleSubmit}>
                <div className=" border-2 border-gray-500 rounded-2xl py-10 px-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] mb-20">
                  <div className="text-center pb-10 text-4xl font-semibold text-blue-300 ">
                    <h1 className="">Add Category</h1>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <div className="">
                      <input
                        type="text"
                        placeholder="Add Category"
                        className="border-1 py-3 px-10 font-semibold font-sans rounded-lg"
                        name="category"
                        id="category"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.category}
                      />
                    </div>
                    <button
                      type="submit"
                      className="border-1 bg-blue-400 text-white py-3 px-2 rounded-lg"
                    >
                      ADD Catogory
                    </button>
                  </div>
                </div>
              </form>
            )}
            <div className="">
              <table className="border-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <tr>
                  <th className="border-2 py-6 px-5">Category</th>
                  <th className="border-2 py-6 px-5">timestamps</th>
                </tr>
                {category && category.length > 0 ? (
                  category.map((item) => (
                    <tr key={item._id}>
                      <td className="border-2 py-2 px-10">{item.category}</td>
                      <td className="border-2 py-2 px-10">{item.createdAt}</td>
                      {isshow.length > 0 && isshow[0].category && (
                        <td className="border-2 py-2 px-4 cursor-pointe">
                          <button onClick={() => handleDelete(item._id)}>
                            Delete
                          </button>
                        </td>
                      )}
                      <td className="border-2 py-2 px-4 cursor-pointe">
                        <button
                          onClick={() => handleFaqRedirect(item.category)}
                        >
                          FAQ's
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center border-2 py-2">
                      No Categories Found
                    </td>
                  </tr>
                )}
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default User;
