import React, { useContext } from 'react'
import { AuthContext } from '../../components/context/AuthContext'
import { Navigate } from 'react-router-dom'


const PrivateRoute = ({children}) => {
    const {hospital,loading}=useContext(AuthContext)
    if (loading){
        return <p>Loading...</p>
    }

    if(!hospital){
        return<Navigate to ="/" replace/>
    }
  return children
    
  
}

export default PrivateRoute
