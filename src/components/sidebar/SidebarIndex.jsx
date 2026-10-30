
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Logout from "../Hospital/Logout";
import DepartmentSidebar from "./DepartmentSidebar";

const SidebarIndex = () => {


  const [activeItem, setActiveItem] = useState("Dashboard");

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const menuButtonClass = (item) =>
    `w-full flex items-center px-4 py-2.5 text-sm rounded-md transition-colors ${
      activeItem === item
        ? "bg-blue-600 text-white"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
    }`;

  const subMenuButtonClass = (item) =>
    `w-full flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
      activeItem === item
        ? "bg-blue-100 text-blue-700 dark:bg-gray-700 dark:text-white"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
    }`;

  const arrowClass = (isOpen) =>
    `w-4 h-4 transition-transform duration-200 ${
      isOpen ? "rotate-90" : ""
    }`;

  return (
    <aside className="w-64 flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 transition-colors duration-300 h-screen overflow-y-auto border-r border-gray-200 dark:border-gray-700 shrink-0">
      {/* Brand Header */}
      <div className="h-16 shrink-0 flex flex-col items-center justify-center border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xl font-light tracking-wide">
        <img
          className="h-9"
          src="/transparant-logo.png"
          alt="Hospital dashboard"
        />
        <small className="text-xs ml-7 text-gray-500 dark:text-gray-400 font-bold">
          Hospital dashboard
        </small>
      </div>

      {/* Filter Menu */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Filter menu..."
          className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1 pb-4">
        {/* Dashboard */}

        <NavLink to="/dashboard">
        <button
          onClick={() => handleItemClick("Dashboard")}
          className={menuButtonClass("Dashboard")}
        >
          <svg
            className="w-5 h-5 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
            />
          </svg>
          Dashboard
        </button></NavLink>

        <DepartmentSidebar  
        arrowClass={arrowClass} 
        subMenuButtonClass ={subMenuButtonClass }
        handleItemClick={handleItemClick}
        />

        {/* Register Department */}

        <NavLink to="/department_register">
        <button
          onClick={() => handleItemClick("Register Department")}
          className={menuButtonClass("Register Department")}
        >
          <svg
            className="w-5 h-5 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Register Department
        </button></NavLink>

        {/* Gallery */}
        <button
          onClick={() => handleItemClick("Gallery")}
          className={menuButtonClass("Gallery")}
        >
          <svg
            className="w-5 h-5 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm4 4h.01M20 15l-5-5L5 19"
            />
          </svg>
          Gallery
        </button>

        <Logout menuButtonClass={menuButtonClass}/>
      </nav>


    </aside>
  );
};

export default SidebarIndex;
