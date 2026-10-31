
import { useEffect, useState } from "react";

import ContentIndex from "../content/ContentIndex";
import FooterIndex from "../footer/FooterIndex";
import HeaderIndex from "../header/HeaderIndex";
import SidebarIndex from "../sidebar/SidebarIndex";
import DepartmentRegister from "../forms/DepartmentRegister";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((previousTheme) =>
      previousTheme === "light" ? "dark" : "light"
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="flex w-full h-full">
        <SidebarIndex />

        <div className="flex flex-col flex-1 overflow-hidden">
          <HeaderIndex
            theme={theme}
            toggleTheme={toggleTheme}
          />
        
          <div className="flex-1 overflow-auto flex flex-col">
             <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 min-h-[500px] border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <div className="text-gray-500 dark:text-gray-400">
          <Outlet/>
        </div>
      </div>
    </main>
            <FooterIndex />
          </div>
        </div>
      </div>
    </div>
  );
}