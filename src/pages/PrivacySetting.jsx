import React, { useContext, useEffect, useState } from 'react'
import Header from './../components/Header';
import ToggleSwitch from '../components/Toggle';
import LoadingPage from '../components/LoadingPage';
import axios from 'axios';
import { MyContext } from '../context/context';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import styles
export default function PrivacySetting() {
    let {Host}=useContext(MyContext)
let [userData,setUserData]=useState(null)
  useEffect(()=>{
    getdata()
  },[])
  let token=localStorage.getItem("sara7a_token")
  async function getdata(){
     try {
      const res = await axios.get(`${Host}/api/v1/user/alldata`, {
        headers: { token }
      });
      setUserData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }


  const handelNoti = async(value) => {
     try {
        const res = await axios.put(`${Host}/api/v1/user/changeTypeNoti`, {allowNoti:value}, {
          headers: { token }
        });
        toast.success("تم التغيير بنجاح")
      } catch (error) {
        toast.error("حدث خطأ عند حفظ التغيير حاول في وقت اخر")
        console.log(error);
      }
  };
  const handelTypeSend = async(value) => {
     try {
        const res = await axios.put(`${Host}/api/v1/user/changeTypeSend`, {typeSend:value}, {
          headers: { token }
        });
        toast.success("تم التغيير بنجاح")
      } catch (error) {
        toast.error("حدث خطأ عند حفظ التغيير حاول في وقت اخر")
        console.log(error);
      }
  };
  const handelStatus = async(value) => {
     try {
        const res = await axios.put(`${Host}/api/v1/user/changestatus`, {status:value}, {
          headers: { token }
        });
        toast.success("تم التغيير بنجاح")
      } catch (error) {
        toast.error("حدث خطأ عند حفظ التغيير حاول في وقت اخر")
        console.log(error);
      }
  };
  return (
     <div>
        <Header/>
        {userData!=null?
        <div className="contprivacydata">
            <h4 className='mx-auto text-center mb-4'> اعدادات الخصوصية</h4>
            <ul>
                <li>
                    <p>    السماح بالمصارحات والرسائل الجديدة  </p>
                    <ToggleSwitch status={userData.status||0} onChange={handelStatus} />
                </li>
                <hr />
                <li>
                    <p>ارسال رساله علي البريد الالكتروني عند تلقي صراحة  </p>
                    <ToggleSwitch status={userData.allowNoti||0} onChange={handelNoti} />
                </li>
                <hr />
                <li>
                    <p>       عدم السماح بغير المسجلين علي الموقع بارسال صراحات لك  </p>
                    <ToggleSwitch status={userData.typeSend||0} onChange={handelTypeSend} />
                </li>
                <hr />
            </ul>
            



        </div>
        :<LoadingPage/>}
    </div>
  )

}
