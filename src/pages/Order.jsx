import React, { useContext, useEffect, useState } from 'react'
import Header from '../components/Header'
import { MyContext } from '../context/context'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import styles
import LoadingPage from '../components/LoadingPage';
import ButtonLoading from '../components/ButtonLoading';
export default function Order() {
    let[why,setWhy]=useState(null)
    let[message,setMessage]=useState(null)
    let[errwhy,setErrWhy]=useState(null)
    let[errmessage,setErrmessage]=useState(null)
    const{Host,token}=useContext(MyContext)

let[useData,setUserData]=useState(null)
let[loading,setLoading]=useState(false)

    useEffect(()=>{
      getData()

    },[])


    async function sendorder(){
      setLoading(true)
        if(why.length>150 || why.length<5){
            return setErrWhy("سبب الطلب يجب ان يكون بين 5 الي 150 حرف")
        }
        if(why.length>150 ){
            return setErrmessage("يجب الا تتخطي المسدج اكتر من 150 حرف ")
        }
        try {
              await axios.post(`${Host}/api/v1/order/add`,{why:why,messageText:message},{
                headers:{
                    "token":localStorage.getItem("sara7a_token")
                }
            })

            toast.success("تم ارسال الطلب بنجاح ,راقب بريدك الالكتروني عند قبول او رفض الطلب سوف  نبغلك")
            setLoading(false)
        } catch (error) {
            console.log(error)
            toast.error("حدث خطأ اثناء ارسال الطلب حاول مره اخري")
            setLoading(false)
        }
    }



  async function getData() {
    try {
      const res = await axios.get(`${Host}/api/v1/user/alldata`, {
        headers: { token }
      });
      setUserData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <Header/>
      {useData!=null?  
      <>

     {useData.type=="user"?<>
      <div className="contorderpage">
        <h5> يمكنك طلب الحصول علي ميزه صارحني بلص مع سبب , وان كان مقنعا سأقبلو </h5>
        <hr />
        <label className='mt-2' > سبب طلب الحصول علي ميزه صارحني بلص </label>
        <textarea value={why} onChange={(e)=>setWhy(e.target.value)} className='form-control' cols="10" >

        </textarea>
        {errwhy&&<p className='text-danger' >{errwhy}</p>}
        <label className='mt-2' >   اترك لنا رسالة مع السبب ان كنت تريد   </label>
        <textarea value={message} onChange={(e)=>setMessage(e.target.value)}  className='form-control' cols="10" >
        </textarea>
        {errmessage&&<p className='text-danger' >{errmessage}</p>}

        <button onClick={sendorder} className='btn btn-primary mt-3'>  {loading?<ButtonLoading/>:"ارسال الطلب"} </button>

      </div></>:<>
        <h1 className='text-center mx-auto mt-5' > انت بالفعل مفعل ميزه حساب صارحني بلص</h1>
      </>}

      </>  
       :<LoadingPage/>}

    </div>
  )
}
