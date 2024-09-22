import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const MyContext = createContext();

const MyProvider = ({ children }) => {

    const[isLogIn,setIsLogIn]=useState(null)
  const token=localStorage.getItem("sara7a_token")
    const Host="https://sara7a-app-back-end.vercel.app";

  const FrontFost = () => {
    const url = window.location.href; // Get the full URL
    const host = new URL(url).host; // Extract the host part
    return host;
  };

    async function checkauth(){
        if(!token){
          return setIsLogIn(false)
        }
        try {
            let res=await axios.get(`${Host}/api/v1/user/protectRoute/${token}`)
            setIsLogIn(res.data.status)
        } catch (error) {
            console.log("Error to protect web",error)
        }
    }
    useEffect(()=>{
        checkauth()
    },[])

     function ProtectRoute({ children }) {
  if (isLogIn == null) {
    return <div>Loading...</div>; 
  }

  return isLogIn ? children : <Navigate to="/login" />;
}


 function ProtectAuth({ children }) {
  if (isLogIn === null) {
    return <div>Loading...</div>; 
  }

 

  return isLogIn ? <Navigate to="/home" />  :children ;
}

  function logOut(){
    localStorage.removeItem("sara7a_token")
    window.location.reload()
  }
function timeAgo(date) {
  const now = new Date();
  const createdAt = new Date(date);
  const diffInMs = now - createdAt; // Difference in milliseconds

  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInMinutes < 1) return "منذ لحظات";
  if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
  if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
  if (diffInDays < 7) return `منذ ${diffInDays} يوم`;
  if (diffInWeeks < 5) return `منذ ${diffInWeeks} أسبوع`;
  if (diffInMonths < 12) return `منذ ${diffInMonths} شهر`;
  return `منذ ${diffInYears} سنة`;
}
    return (
        <MyContext.Provider value={{ Host,checkauth,isLogIn,FrontFost,setIsLogIn,ProtectAuth,ProtectRoute,logOut,timeAgo,token }}>
            {children}
        </MyContext.Provider>
    );
};

export { MyProvider, MyContext };
