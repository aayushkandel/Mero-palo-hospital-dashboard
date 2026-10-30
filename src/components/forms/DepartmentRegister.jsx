// src/UserForm.jsx
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { departmentRegister } from "../../api/FetchApi";

const DepartmentRegister = () => {
  const [departCredentials,setDepartCredentials]=useState({
    name:"",
    phone:"",
    department_room_no:"",
    password:"",
    confirm_password:""
  })
  const[registerSuccess,setRegisterSuccess]=useState(null)
  const [error,setError]=useState(null)

  const handleChange=(e)=>{
      const {name,value}=e.target

      setDepartCredentials((prev)=>{
        return{
          ...prev,[name]:value,
        }
      })
      setError(null);
  }

  const newDepartmentRegister=async(departCredentials)=>{
    try {
      const res= await departmentRegister(departCredentials);
      console.log("Register Response",res.data)

      if (res.status === 201){
        setRegisterSuccess("Department Register Sucessful")
      }
    } catch (error) {
      console.log("status",error)

      if( error.response){
        setError(error.response.data.detail)
      }
      else{
        setError("Something went wrong")
      }
    }
   
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    await newDepartmentRegister(departCredentials)
  };

  return (
    // Max width container, centered with padding, supporting dark mode
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Create New Department
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Please fill out the information below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {registerSuccess && (
          <div className="bg-green-100 text-green-600 p-3 rounded-md mb-4 flex justify-between">
            {registerSuccess} <span onClick={()=>setRegisterSuccess(null)}>❌</span>
          </div>
        )}

         {error && (
    <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4 flex justify-between" >
        {error} <span onClick={()=>setError(null)} className="cursor-pointer">❌</span>
    </div>
)}
        {/* Grid Layout for inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Field 1: First Name */}
          <div>
            <label
              htmlFor="departmentName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Department Name
            </label>
            <input
              type="text"
              id="departmentName"
              name="name"
              value={departCredentials.name}
              onChange={handleChange}
              placeholder="OPD"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          {/* Field 2: Last Name */}
          <div>
            <label
              htmlFor="contactNumber"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Contact Number
            </label>
            <input
              type="text"
              id="contactNumber"
              name="phone"
              value={departCredentials.phone}
              onChange={handleChange}
              placeholder="98........."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>
        </div>

        {/* Field 3: Email (Full width) */}
        <div>
          <label
            htmlFor="department_room_no"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Department Room Number
          </label>
          <input
            type="text"
            id="department_room_no"
            name="department_room_no"
            value={departCredentials.department_room_no}
              onChange={handleChange}
            placeholder="OPD - 101"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            required
          />
        </div>

        {/* Grid Layout for remaining inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Field 4: Phone Number */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              type="text"
              id="password"
              name="password"
              value={departCredentials.password}
              onChange={handleChange}
              placeholder="Password Please"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* Field 5: Company */}
          <div>
            <label
              htmlFor="comfirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Confirm Password
            </label>
            <input
              type="text"
              id="comfirmPassword"
              name="confirm_password"
              value={departCredentials.confirm_password}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
           type="submit"
            className="w-full md:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepartmentRegister;
