import React from "react";
import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import About from "./About";
import UserList from "./User";
import "../App.css";

const Main = () => {
  const isLoggedIn = false;
  const currentusername = localStorage.getItem("current_user");
  console.log(currentusername);

  console.log("isLoggedIn:", isLoggedIn);

  const logout = () => {
    localStorage.removeItem("current_user");
    window.location.reload();
  };

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
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
};

export default Main;
