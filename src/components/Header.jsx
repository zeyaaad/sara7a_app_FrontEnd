import React, { useContext, useEffect, useRef, useState } from 'react'

import LoadingPage from './LoadingPage';
import img from "./userImg.jpeg"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import styles
import { MyContext } from '../context/context';
import axios from 'axios';
export default function Header() {
    let {FrontFost}=useContext(MyContext)
    let [userData,setUserData]=useState(null)
    const userLinkRef = useRef(null);
     const copyUserLink = () => {
    userLinkRef.current.select();
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    toast.success('تم نسخ الرابط بنجاح!');
  };
  let {Host}=useContext(MyContext)
  let token=localStorage.getItem("sara7a_token")
useEffect(()=>{
    getData()
},[])
    async function getData() {
    try {
      let res = await axios.get(`${Host}/api/v1/user/alldata`, {
        headers: {
          "token": token
        }
      });
    setUserData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }
  return (
        <div className='messagespage'>
        <ToastContainer/>
      {userData?<div className="headerMessages">
          <img className='userImg' src={img} alt="user img" width={120} />
          <h4>{userData.name}</h4>
          <p className='linksara7a' >{`${FrontFost()}/sendmessage/${userData._id}`}</p>
          <p className='user_link'>
            <input
              type="text"
              value={`${FrontFost()}/sendmessage/${userData._id}`}
              readOnly
              style={{ position: 'absolute', opacity: "0" }}
              ref={userLinkRef}
            />
          </p>
          <p>شارك الرابط وابدأ بتلقي الرسائل والصراحات</p>
          <button className='btn btn-primary mb-2' onClick={copyUserLink}>
            نسخ الرابط
          </button>
        </div>:<LoadingPage/>}
        
        
    </div>
  )
}
