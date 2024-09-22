import axios from 'axios'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { MyContext } from '../context/context'
import LoadingPage from './../components/LoadingPage';
import img from "./../components/userImg.jpeg"
import {FaArrowLeft , FaEnvelope, FaStar,FaUser, FaPaperPlane ,FaInfo } from 'react-icons/fa';  // Font Awesome icons
import { AiOutlineArrowUp, AiOutlineSetting, AiOutlineLogout } from 'react-icons/ai';
import { IoPersonOutline, IoChatboxEllipsesOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
export default function Settings() {

  function logout(){
    localStorage.removeItem("sara7a_token");
    window.location.reload()
  }
  return (
    <div className='messagespage'>
        <Header/>
        <div className='allsettings' >
            <ul>
                <Link className='settingsnav' to="/order" >
                 <li>
                <div className="right">
                    <AiOutlineArrowUp/>
                    <span>                 تريقة الحساب </span>
                </div>
                <div className='left' >
                    <FaArrowLeft/>
                </div>
                </li>
                </Link>
               <Link className='settingsnav' to="/personalinfo" >

                <li>
                 <div className="right">
                    <IoPersonOutline />
                    <span>                  المعلومات الشخصية
 </span>
                </div>
                <div className='left   ' >
                    <FaArrowLeft/>
                </div>
                </li>
               </Link>
               <Link className='settingsnav' to="/privacysettings" >

                <li>
                <div className="right">
                    <AiOutlineSetting />
                    <span>                 اعدادات الخصوصيه
 </span>
                </div>
                <div className='left   ' >
                    <FaArrowLeft/>
                </div>
                </li>
               </Link>
                <Link className='settingsnav' to="/contact" >

                <li>
                <div className="right">
                    <IoChatboxEllipsesOutline />
                    <span>                تواصل معنا 
 </span>
                </div>
                <div className='left   ' >
                    <FaArrowLeft/>
                </div>
                </li>
                </Link>
                <Link className='settingsnav' onClick={logout}>
                    
                <li>
               <div className="right">
                    <AiOutlineLogout />
                    <span>                  تسجيل الخروج
 </span>
                </div>
                <div className='right   ' >
                    <FaArrowLeft/>
                </div>
                </li>
                </Link>
            </ul>
           
            
        </div>
        
    </div>
  )
}
