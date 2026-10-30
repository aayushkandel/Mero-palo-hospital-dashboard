// src/Register.jsx
import React, { useContext, useState } from 'react';
import { hospitalRegister } from '../../api/FetchApi';
import { AuthContext } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';

const Register = () => {
 const [register,setRegister]=useState({
  name:"",
  phone:"",
  registration_no:"",
  password:"",
  confirm_password:"",
 })


 const{loading,setLoading}=useContext(AuthContext)
 const[error,setError]=useState(null)

 const handleChange=(e)=>{
  const name=e.target.name;
  const value=e.target.value;

  setRegister((prev)=>{
  return{
    ...prev,
    [name]:value,
  }
  })
  setError(null);
 }

const newHospitalRegister=async(register)=>{

  try {
    const res=await hospitalRegister(register)
    console.log("Register Respone:",res.data);

    if (res.status===201){
      console.log("register successful",res.data);
    
     
    }
  } catch (error) {
    console.log("Status",error)
    if(error.response){
      setError(error.response.data.detail)
    }
  }
  finally{
    setLoading(false);
  }
}

 const handleSubmit=async(e)=>{
  e.preventDefault();
  setLoading(true);
  await newHospitalRegister(register);
 }



  return (
    // Outer container: Centers the register box vertically and horizontally
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12 transition-colors duration-300">
      
      {/* Register Card */}
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 mb-4">
            {/* Hospital/Building Icon */}
            <span><img src="../../public/main_logo_transparant.png" alt="" /></span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Hospital Registration
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Create an account to manage your facility
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
           {error && (
    <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4">
        {error}
    </div>
)}
          {/* Hospital Name */}
          <div>
            <label htmlFor="hospitalName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Hospital Name
            </label>
            <input
              type="text"
              id="hospitalName"
              name="name"
              value={register.name}
              onChange={handleChange}
              placeholder="City General Hospital"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          {/* Grid for Phone and Registration No */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
              value={register.phone}
              onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            {/* Registration No */}
            <div>
              <label htmlFor="registrationNo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Registration No.
              </label>
              <input
                type="text"
                id="registrationNo"
                name="registration_no"
                value={register.registration_no}
              onChange={handleChange}
                placeholder="REG-123456"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
             value={register.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
              minLength="6"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirm_password"
              value={register.confirm_password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-colors" 
              required
              minLength="6"
            />
        
          
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors mt-2"
          >
            Register Hospital
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <NavLink to="/">
          <span className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            Sign in
          </span></NavLink>
        </p>
      </div>
    </div>
  );
};

export default Register;