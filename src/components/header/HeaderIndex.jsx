import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'

const HeaderIndex = ({ theme, toggleTheme }) => {
  const {profile,checkAuth}=useContext(AuthContext);

  useEffect(()=>{
    checkAuth();
  },[])

  return (
<>
<header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 transition-colors duration-300">
      {/* Search Bar */}
      <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-1.5 w-64">
        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent border-none outline-none text-sm w-full text-gray-700 dark:text-gray-200 placeholder-gray-500"
        />
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center space-x-4">
        {/* Fullscreen Icon */}
        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>

        {/* Theme Toggle Button */}
        <button onClick={toggleTheme} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          {theme === 'light' ? (
            // Moon Icon for switching to dark
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            // Sun Icon for switching to light
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </button>

        {/* User Profile */}
        <div className="flex items-center border-l border-gray-300 dark:border-gray-600 pl-4">
          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center overflow-hidden mr-2">
             <img src="https://i.pravatar.cc/150?img=68" alt="User Avatar" className="w-full h-full object-cover" />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{profile.name}</span>
        </div>
      </div>
    </header>
</>

  )
}

export default HeaderIndex