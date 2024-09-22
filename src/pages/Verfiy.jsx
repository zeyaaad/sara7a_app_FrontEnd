import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import LoadingPage from '../components/LoadingPage'
import { MyContext } from '../context/context'

export default function Verfiy() {
    let[status,setStatus]=useState(null)
    let{token}=useParams()
    useEffect(()=>{
        if(token){
            verfiy()
        } else {
            setStatus(false)
        }
    },[])
    let{Host}=useContext(MyContext)
    async function verfiy(){
        try {
            let res=await axios.get(`${Host}/api/v1/user/verify/${token}`)
            console.log(res)
            if(res.data.message=="success"){
                setStatus(true)
            } else {
                setStatus(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
    <div className='container' >
        {status!==null?<div className="verficon">
            <h4> {status?"تمت المصادقة بنجاح توجه الي صفحه تسجيل الدخول" : "Invalid or expired token"} </h4>
            {status&&<Link className='btn btn-primary' to="/login"> العوده الي صفحه تسجيل الدخول </Link>}
        </div>:<LoadingPage/>}
        
    </div>
  )
}
