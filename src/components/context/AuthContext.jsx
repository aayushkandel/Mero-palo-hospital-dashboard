import { createContext, useEffect, useState } from "react";
import { hospitalLogin, hospitalProfile } from "../../api/FetchApi";
import api from "../../api/Interceptor";


export const  AuthContext= createContext();

export const AuthProvider=({children})=>{
    const [hospital,setHospital]= useState(null);
    const [loading,setLoading]=useState(true);
    const[profile,setProfile]=useState([])


    const getProfile=async()=>{
        try {
            const res = await hospitalProfile();
            setProfile(res.data);
        } catch (error) {
            console.error("Profile Error",error.message);
            setProfile([])
        }
    }

    const checkAuth=async ()=>{
        const token = localStorage.getItem("token");
        if(!token){
            setLoading(false);
            return;
        }
        try {
            setHospital(token);
            await getProfile();
        } catch (error) {
            console.log("Authentication Failed:",error);

            localStorage.removeItem("token");
            delete api.defaults.headers.common[ "Authorization" ];

            setHospital(null);
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        checkAuth();
    },[])


    const authLogin= async (credentials)=>{
        setLoading(true);
        try {
            const res=await hospitalLogin(credentials);
            console.log("Login Respone:",res.data);

            const token = res.data.data?.token ?? res.data.token;
            localStorage.setItem("token",token)

            setHospital(token);
            return{
                success:true
            }
        } catch (error) {
            
         console.log("STATUS:", error);
      console.log("ERROR:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.detail ?? "Something went wrong!",
      };
    } finally {
      setLoading(false);
    }
    }

    // logout the hospital
    
    const logout = ()=>{
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
        setHospital(null);
        setProfile([])
    };


    return(
       <AuthContext.Provider value={{hospital,setHospital,loading,setLoading,authLogin,profile,logout,checkAuth}}>{children}</AuthContext.Provider>
    )
}