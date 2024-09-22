import React, { useContext, useState } from 'react'
import Header from '../components/Header'
import { MyContext } from '../context/context'
import axios from 'axios'
import LoadingPage from '../components/LoadingPage'
import logo from "../components/userImg.jpeg"
import { Link } from 'react-router-dom'

export default function SearchPage() {

    let {Host}=useContext(MyContext)
    let [users,setusers]=useState([])


    async function handelChange(value){
        setusers(null)
        if(value.trim().length>0){
            try {
                let res=await axios.get(`${Host}/api/v1/user/search/${value}`,{
                    headers:{
                        "token":localStorage.getItem("sara7a_token")
                    }
                })
                if(res.data.data.length==0){
                    setusers("no results")
                } else {
                    
                    setusers(res.data.data)
                }
            } catch (error) {
                console.log(error)
            }            
        } else {
            setusers([])
        }
    }

  return (
    <div>
        <Header/>
        <div className="contsearchpage ">
            <h4>   اكتب اسم المستخدم اللذي تريد البحث عنه </h4>
            <input onChange={(e)=>handelChange(e.target.value)} type="text" className='form-control mt-2 text-dark'  />
            <div className="results">
                {users!=null?<>
                {users!="no results"?<>
                 {users.length>0?<>
                        <ul className='allusers'>
                            {users.map((user)=>
                            <li className='mt-1'> 
                                <Link className='user' to={`/sendmessage/${user._id}`} >
                                    <div className="userdata">
                                        <img src={logo} width={50} alt="" />
                                    <p className='mt-3 me-3 text-dark' > {user.name} </p>
                                    </div>
                                    <Link to={`/sendmessage/${user._id}`} className='btn btn-primary'> ارسال رسالة  </Link>
                                </Link>
                            </li>
                            )}
                        </ul>
                    </>:""}
                </>:<>
                        <h3 className='mt-5' > لا يوجد مستخدمين بهذا الاسم </h3>
                </>}
                   
                </>:    <div class="text-center mt-5">
        <h3></h3>
        <div class="spinner-border" role="status">
            <span class="visually-hidden"></span>
        </div>
    </div> }
            </div>
        </div>
    </div>
  )
}
