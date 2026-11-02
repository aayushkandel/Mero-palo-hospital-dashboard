import { useState } from 'react'
import './App.css'
import SidebarIndex from './components/sidebar/SidebarIndex';
import HeaderIndex from './components/header/HeaderIndex';
import ContentIndex from './components/content/ContentIndex';
import FooterIndex from './components/footer/FooterIndex';
import AdminLayout from './components/admin-layout/adminLayout';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DashboardIndex from './pages/dashboard/dashboardIndex';
import DepartmentRegister from './components/forms/DepartmentRegister';
import Schedule from './components/schedules/Schedule';
import Login from './components/Hospital/Login';
import Register from './components/Hospital/Regster';
import { AuthProvider } from './components/context/AuthContext';
import PrivateRoute from './api/private route/PrivateRoute';
import Profile from './components/depart-profile/Profile';
import GallaryIndex from './components/gallary/GallaryIndex';
import DepartGallery from './components/gallary/DepartGallary';

function App() {

  const router= createBrowserRouter([
    {
      path:"/",
      element:<Login/>
    },

    {
      path:"/register",
      element:<Register/>
    },
    {
  
      element:<AdminLayout/>,
      children:[
        {
          path:"/dashboard",
          element:(
            <PrivateRoute><DashboardIndex/></PrivateRoute>
          )
        },
        {
          path:"/department_register",
          element:<PrivateRoute><DepartmentRegister/></PrivateRoute>
        },
        {
          path:"/mydepartments/schedules/:departId",
          element:<PrivateRoute><Schedule/></PrivateRoute>
        },
        {
          path:"/mydepartments/profile/:departId",
          element:<PrivateRoute><Profile/></PrivateRoute>
        },
        {
          path:"/mydepartments/gallary/:departId",
          element:<PrivateRoute><DepartGallery/></PrivateRoute>
        },
        {
          path:"/gallary",
          element:<PrivateRoute><GallaryIndex/></PrivateRoute>
        },
      ]

    }
  ])

  return (
    <>
    <AuthProvider>
    <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
    </>
  )
}

export default App
