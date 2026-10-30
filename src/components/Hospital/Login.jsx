// src/Login.jsx
import React, { useContext, useState } from 'react';
import { hospitalLogin } from '../../api/FetchApi';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [credentials,setCredentials]=useState({phone:"",password:""})
  const [error,setError]=useState(null);
  const{authLogin}=useContext(AuthContext);
  const navigate=useNavigate()

 const handleChange=(e)=>{
    const name=e.target.name;
    const value=e.target.value;

    setCredentials((prev)=>{
        return{
            ...prev,[name]:value,
        }
    })
 }



 const handleSubmit= async(e)=>{
    e.preventDefault();
  const {success,message}=await authLogin(credentials); 
  console.log("Success",success);
  if (success){
    navigate("/dashboard");
  }else{
    setError(message);
  }
 }
  


  return (
    // Outer container: Centers the login box vertically and horizontally
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-300">
      
      {/* Login Card */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        
        {/* Header */}
        <div className="text-center mb-8">
            <div className='w-30 ml-33'><img src="../../public/favi.png" alt="" /></div>
     
          <p className="text-m   text-gray-500 dark:text-gray-400 mt-2">
            Please sign in to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}  className="space-y-5">
          {error && (
    <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4">
        {error}
    </div>
)}
          {/* Phone Number Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name='phone'
              placeholder="9800000000"
              value={credentials.phone}
              onChange={handleChange}
             
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <a href="#" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              id="password"
              placeholder="Enter Password"
              value={credentials.password}
              name='password'
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
          >
            Sign In
          </button>
        </form>

        {/* Footer Link */}
        
        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <NavLink to="/register">
          <div className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            Sign up
          </div></NavLink>
        </div>
      </div>


    </div>
  );
};

export default Login;