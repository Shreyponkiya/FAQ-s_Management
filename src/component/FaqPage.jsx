import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/i18n"; // Import i18n

const API_urlfaq = "https://faq-s-management-server-13.onrender.com/faqs";
const API_urluser = "https://faq-s-management-server-13.onrender.com/user";

const FaqPage = () => {
  const { t } = useTranslation(); // Use translation function
  const [faqs, setFaqs] = useState([]);
  const [ismodel, setismodel] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [data, setdata] = useState(false);
  const [loading, setLoading] = useState(false);
  const [whatcategory, setwhatcategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setsearch] = useState("");
  const location = useLocation();
  const faqsPerPage = 5;
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");
  useEffect(() => {
    if (category) {
      fetchFaqs();
      setwhatcategory(category);
    }
    const get_user = async () => {
      const data = await axios.get(API_urluser);

      const user_data = data.data.filter(
        (user) => user._id === localStorage.getItem("current_user")
      );
      setdata(user_data);
    };
    get_user();
  }, [category]);

  const fetchFaqs = async () => {
    try {
      const response = await axios.get(API_urlfaq);
      const filteredFaqs = category
        ? response.data.filter((faq) => faq.category === category)
        : response.data;

      setFaqs(filteredFaqs);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      que: "",
      ans: "",
    },
    enableReinitialize: true, // Allow form values to update when editing
    onSubmit: async (values) => {
      if (editingFaq) {
        await submitUpdate(values);
      } else {
        await submitHandle(values);
      }
    },
  });
  const submitHandle = async (values) => {
    if (!values.que || !values.ans) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      await axios.post(`${API_urlfaq}/add`, {
        que: values.que,
        ans: values.ans,
        category: whatcategory,
      });
      fetchFaqs();
      formik.resetForm();
      setismodel(false);
    } catch (error) {
      console.error("Error creating FAQ:", error);
    }
  };

  const submitUpdate = async (values) => {
    if (!values.que || !values.ans) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await axios.put(`${API_urlfaq}/update/${editingFaq._id}`, {
        que: values.que,
        ans: values.ans,
      });

      fetchFaqs(); // Refresh FAQ list
      setEditingFaq(null);
      formik.resetForm();
      setismodel(false);
    } catch (error) {
      console.error("Error updating FAQ:", error);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this FAQ?"
    );
    if (!isConfirmed) return;
    setLoading(true);
    try {
      await axios.delete(`${API_urlfaq}/delete/${id}`);
      fetchFaqs(); // Refresh FAQ list
    } catch (error) {
      console.error("Error deleting FAQ:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() === "") {
      fetchFaqs(); // Show all FAQs if search is empty
    } else {
      const filteredFaqs = faqs.filter(
        (faq) =>
          faq.que.toLowerCase().includes(search.toLowerCase()) ||
          faq.ans.toLowerCase().includes(search.toLowerCase())
      );
      setFaqs(filteredFaqs);
      // setCurrentPage(1);
    }
  };

  useEffect(() => {});

  const handleEdit = (faq) => {
    setEditingFaq(faq);
    formik.setValues({ que: faq.que, ans: faq.ans });
    setismodel(true);
  };
  const indexOfLastFaq = currentPage * faqsPerPage;
  const indexOfFirstFaq = indexOfLastFaq - faqsPerPage;
  const currentFaqs = faqs.slice(indexOfFirstFaq, indexOfLastFaq);

  const nextPage = () => {
    if (currentPage < Math.ceil(faqs.length / faqsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="px-40 pt-10">
      <h1 className="text-3xl font-bold mb-6">
        {t("faq_title", { category })}
      </h1>
      <div className="flex justify-between items-center">
        <div>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              name="search"
              id="search"
              placeholder={t("search_placeholder")}
              className="border-2 border-gray-600 rounded-lg py-3 px-9 text-lg"
              onChange={(e) => setsearch(e.target.value)}
            />
            <button
              type="submit"
              className="ml-2 border-2 bg-blue-400 rounded-lg py-3 px-11 text-lg text-white"
            >
              {t("search_button")}
            </button>
          </form>
        </div>
        {data.length > 0 && data[0].category && (
          <button
            onClick={() => {
              setEditingFaq(null);
              formik.resetForm();
              setismodel(true);
            }}
            className="ml-2 border-2 bg-blue-400 rounded-lg py-3 px-11 text-lg text-white"
          >
            {t("add_faq")}
          </button>
        )}
      </div>
      <hr className="my-20" />
      {ismodel && (
        <div className="absolute h-[80vh] flex justify-center items-center rounded-2xl bg-white w-200 border-2 top-[10%] left-[25%] shadow-lg">
          <div className="flex flex-col justify-center items-center bg-gray-200 rounded-3xl w-[80%] h-[80%] p-6">
            <h1 className="text-4xl font-bold text-center mb-5">
              {editingFaq ? "Edit FAQ" : "Add New FAQ"}
            </h1>
            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-col">
                <label
                  htmlFor="que"
                  className="text-lg pl-2 text-gray-800 py-3"
                >
                  Question:
                </label>
                <input
                  type="text"
                  className="py-3 px-8 w-full rounded-lg border-1 border-gray-500"
                  placeholder="Add Question"
                  name="que"
                  id="que"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.que}
                />
              </div>
              <div className="">
                <label
                  htmlFor="ans"
                  className="text-lg pl-2 text-gray-800 py-3"
                >
                  Answer:
                </label>
                <input
                  type="text"
                  placeholder="Add Answer"
                  className="py-3 px-8 w-full rounded-lg border-1 border-gray-500"
                  name="ans"
                  id="ans"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.ans}
                />
              </div>
              <div className="flex flex-row justify-between mt-5 mx-3">
                <button
                  type="submit"
                  className={
                    "border-2 bg-gray-300 py-3 px-4 rounded-lg hover:bg-gray-400"
                  }
                >
                  {editingFaq ? "Update FAQ" : "Add FAQ"}
                </button>
                <button
                  className="border-2 py-2 px-4 rounded-lg bg-gray-300 hover:bg-gray-400"
                  type="button"
                  onClick={() => {
                    formik.resetForm();
                    setismodel(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-6">
        {faqs.length > 0 ? (
          currentFaqs.map((faq) => (
            <div key={faq._id} className="">
              <div className="border p-4 mb-4">
                <div>
                  <p>
                    <strong>Q:</strong> {faq.que}
                  </p>
                  <p>
                    <strong>A:</strong> {faq.ans}
                  </p>
                </div>
              </div>
              {data.length > 0 && data[0].category && (
                <div className="flex justify-end mb-5">
                  <button
                    className="border-1 py-2 px-5 rounded-lg text-lg bg-blue-400 text-white"
                    onClick={() => handleEdit(faq)}
                  >
                    Edit
                  </button>
                  <button
                    className="border-1 py-2 px-5 rounded-lg text-lg bg-blue-400 text-white"
                    onClick={() => handleDelete(faq._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No FAQ's found for this category.</p>
        )}
      </div>
      <div className="flex justify-center mt-4 mb-30">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="bg-gray-500 text-white px-4 py-2 mr-2 rounded"
        >
          {t("prev")}
        </button>
        <span className="px-4 py-2">
          {t("page")} {currentPage} / {Math.ceil(faqs.length / faqsPerPage)}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === Math.ceil(faqs.length / faqsPerPage)}
          className="bg-gray-500 text-white px-4 py-2 ml-2 rounded"
        >
          {t("next")}
        </button>
      </div>
    </div>
  );
};

export default FaqPage;
