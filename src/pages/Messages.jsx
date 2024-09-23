import axios from 'axios'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { MyContext } from '../context/context'
import LoadingPage from './../components/LoadingPage';
import img from "./../components/userImg.jpeg"
import { FaEye, FaTrash, FaEnvelope, FaStar, FaPaperPlane } from 'react-icons/fa';  // Font Awesome icons
import { Spinner } from 'react-bootstrap';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import styles
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import ButtonLoading from '../components/ButtonLoading';

export default function Messages() {

  const [allMessages, setAllMessages] = useState(null)
  const { Host, FrontFost, timeAgo } = useContext(MyContext)
  const token = localStorage.getItem("sara7a_token")
  const userDataLocal = JSON.parse(localStorage.getItem("user_data"))
  const userLinkRef = useRef(null);
  const [activeTab, setActiveTab] = useState('inbox');  // Default tab is 'inbox'
  const [selectedMessage, setSelectedMessage] = useState(null);  // Track message for modal
  const [showModal, setShowModal] = useState(false);  // Track modal visibility
  const [showModal2, setShowModal2] = useState(false);  // Track modal visibility
  const[favMessages,setFavMessages]=useState(null);
  const[seendingMessages,setseendingMessages]=useState(null);
  const[userData,setUserData]=useState(null);
  const[whoSendData,setWhoSendData]=useState(null);
  const[loading,setLoading]=useState(false);
  useEffect(() => {
    getuserData()
    getMessages()
    getFav()
    getseedningmessages()

  }, [])


  useEffect(()=>{
    // seen()
  },[])

  // async function seen(){
  //   try {
  //     let res=await axios.post(`${Host}/api/v1/message/seen`,{
  //       headers:{
  //         token:token
  //       }
  //     })
  //     console.log(res)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  

  async function getuserData(){
    try {
      let res=await axios.get(`${Host}/api/v1/user/alldata`,{
        headers:{
          "token":token
        }
      })
      setUserData(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }


  async function getSentData(messageId){
    if(userData.type!="pro"){
      return toast.error("يجب ان ترقي حسابك الي صراحه بلص لرؤيه معلومات المرسل")
    }
    try {
      let res=await axios.post(`${Host}/api/v1/message/messageseender`,{messageId:messageId},{
        headers:{
          "token":token
        }
      })
      if(res.data.message=="success"){
        if(res.data.data==null){
          setWhoSendData("not")
        } else {
          setWhoSendData(res.data.data)
        }
      } else {
        setWhoSendData("not")
      }
      setShowModal2(true)
    } catch (error) {
        console.log(error)
        toast.error("حدث خطأ اثناء ايجاد معلومات المرسل")
    }
  }




  async function getMessages() {
    try {
      let res = await axios.get(`${Host}/api/v1/message`, {
        headers: {
          token: token
        }
      })
      setAllMessages(res.data.data.reverse())
    } catch (error) {
      console.log(error)
    }
  }


  const copyUserLink = () => {
    userLinkRef.current.select();
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    toast.success('تم نسخ الرابط بنجاح!');
  };

  async function deleteMessage(id) {
    setLoading(true)
    try {
      let res = await axios.delete(`${Host}/api/v1/message`, {
        headers: {
          token: token
        },
        data: { messageId: id }
      });
      toast.success("تم حذف الرسالة بنجاح")
      getMessages()
      getFav()
      getseedningmessages()
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error);
    }
  }

  async function addtofav(id) {
        try {
          let res = await axios.post(`${Host}/api/v1/message/fav`, JSON.stringify({ messageId: id }), {
            headers: {
              'Content-Type': 'application/json',
              token: token
            }
          })
          getMessages()
          getFav()
          toast.success("تم اضافه الرساله الى الرسائل المفضلة")
        } catch (error) {
      console.log(error)
    }
  }

  async function removeFromFav(id) {
    setLoading(true)
    try {
      let res = await axios.delete(`${Host}/api/v1/message/fav`, {
        headers: {
          token: token
        },
        data: { messageId: id }
      });
      toast.success("تم حذف الرسالة من المفضلة بنجاح")
      getMessages()
      getFav()
      setLoading(false)
    } catch (error) {
      setLoading(true)
      console.log(error);
    }
  }

  const handleShowClick = (message) => {
    setSelectedMessage(message);
    setShowModal(true);
  };
  const handleShowClick2 = (message) => {
    setShowModal2(true);
  };


  const confirmShowMessage = async () => {
    
   try {
  let res = await axios.put(`${Host}/api/v1/message/makeGeneral`,
    { messageId: selectedMessage._id },  
    {
      headers: {
        token: token  
      }
    }
  );
  setShowModal(false);
  toast.success("تم إظهار الرسالة بنجاح");
  getMessages()

} catch (error) {
  console.log(error);
  toast.error("حدث خطأ أثناء إظهار الرسالة");
}

  };



  async function hidefromPublic(id){
    setLoading(true)
    try {
      let res = await axios.put(`${Host}/api/v1/message/makePrivate`,
      { messageId: id },  
      {
        headers: {
          token: token 
        }
      }
      );
      setShowModal(false);
      toast.success("تم اخفاء الرسالة بنجاح");
      getMessages()
      setLoading(false)
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ أثناء اخفاء الرسالة");
      setLoading(false)
    }

  }



  async function getFav(){
    try {
      let res =await axios.get(`${Host}/api/v1/message/fav`,{
        headers:{
          token:token
        }
      })
      setFavMessages(res.data.data.reverse())
    } catch (error) {
      console.log(error)
    }
  }
  async function getseedningmessages(){
    try {
      let res =await axios.get(`${Host}/api/v1/message/sending`,{
        headers:{
          token:token
        }
      })
      setseendingMessages(res.data.data.reverse())
    } catch (error) {
      console.log(error)
    }
  }




  return (
    <div className='messagespage '>
      <Header/>
        
       
        <>
          <div className="contallmessages text-center mt-3 container">
            <div className="allmessagees">
              <div className="tabs">
                <button
                  className={`tab ${activeTab === 'inbox' ? 'active' : ''}`}
                  onClick={() => setActiveTab('inbox')}
                >
                  <FaEnvelope className='ms-1' size={20} />
                  <span>رسائل واردة</span>
                </button>
                <button
                  className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
                  onClick={() => setActiveTab('favorites')}
                >
                  <FaStar className='ms-1' size={20} />
                  <span>المفضلة</span>
                </button>
                <button
                  className={`tab ${activeTab === 'sent' ? 'active' : ''}`}
                  onClick={() => setActiveTab('sent')}
                >
                  <FaPaperPlane className='ms-1' size={20} />
                  <span>مرسلة</span>
                </button>
              </div>

              {activeTab=="inbox"? <>
                {allMessages!=null? <>
                {allMessages.length>0?
                <> 
                       <div className="messagecontinf mt-2">
                <h5>الرسائل: <span className='countmessags'>{allMessages.length}</span></h5>
                <p>يتم ترتيب الرسائل من الحديثه للقديمه</p>
              </div>
              {allMessages.map((message, i) =>
                <div className='contmessage text-dark mt-2' key={i}>
                  <div className="messagehead">
                    <p> مجهول: <span className='timemessage'>{timeAgo(message.createdAt)}</span> </p>
                    {message.fav == 0 ? <FaStar onClick={() => addtofav(message._id)}
                      data-tip="Add To Favourite messages"
                      style={{ color: 'transparent', stroke: 'black', strokeWidth: '15', cursor: 'pointer' }}
                      size={30}
                    /> : <FaStar onClick={() => removeFromFav(message._id)}
                      data-tip="Add To Favourite messages"
                      color='gold'
                      style={{ stroke: 'black', strokeWidth: '10', cursor: 'pointer' }}
                      size={30}
                    />}
                  </div>
                  <hr />
                  <p className='messagedata'>{message.messageText}</p>
                  <hr />
                  <div className="buttons">
                    {message.type == 0 ?
                      <button className='btn btn-primary' onClick={() => handleShowClick(message)}> {loading?<ButtonLoading/>:"اظهار"} < FaEye style={{ cursor: 'pointer' }} size={15} /></button>
                      :
                      <button onClick={()=>hidefromPublic(message._id)} className='btn btn-success'> {loading?<ButtonLoading/>:"اخفاء من العامة"} < FaEye style={{ cursor: 'pointer' }} size={15} /></button>
                    }
                    <button onClick={() => deleteMessage(message._id)} className='btn btn-danger'> {loading?<ButtonLoading/>:"حذف"} < FaTrash style={{ cursor: 'pointer' }} size={15} /></button>

                  </div>
                  <p onClick={()=>getSentData(message._id)} className='text-end whosendbtn mt-3' > من المرسل؟ < FaEye style={{ cursor: 'pointer' }} size={15} /> </p>
                </div>
              )}
                </>
             :
                <><div className='mt-5 text-center'>
            <h1> لم تصلك اي رسائل بعد.. </h1>
            <p> شارك اللينك مع اصدقائك ليصلك رسائلهم </p>
          </div></>}
                </> : <>  <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Spinner animation="border" role="status">
        <span className="visually-hidden"></span>
      </Spinner>
    </div> </>}
              
              </>:""}
              {activeTab=="favorites"? <>
                {favMessages!=null? <>
                {favMessages?.length>0?
                <> 
                       <div className="messagecontinf mt-2">
                <h5>الرسائل المفضلة: <span className='countmessags'>{favMessages?.length}</span></h5>
                <p>يتم ترتيب الرسائل من الحديثه للقديمه</p>
              </div>
              {favMessages?.map((message, i) =>
                <div className='contmessage text-dark mt-2' key={i}>
                  <div className="messagehead">
                    <p> مجهول: <span className='timemessage'>{timeAgo(message.createdAt)}</span> </p>
                    {message.fav == 0 ? <FaStar onClick={() => addtofav(message._id)}
                      data-tip="Add To Favourite messages"
                      style={{ color: 'transparent', stroke: 'black', strokeWidth: '15', cursor: 'pointer' }}
                      size={30}
                    /> : <FaStar onClick={() => removeFromFav(message._id)}
                      data-tip="Add To Favourite messages"
                      color='gold'
                      style={{ stroke: 'black', strokeWidth: '10', cursor: 'pointer' }}
                      size={30}
                    />}
                  </div>
                  <hr />
                  <p className='messagedata'>{message.messageText}</p>
                  <hr />
                  <div className="buttons">
                    {message.type == 0 ?
                      <button className='btn btn-primary' onClick={() => handleShowClick(message)}> اظهار < FaEye style={{ cursor: 'pointer' }} size={15} /></button>
                      :
                      <button onClick={()=>hidefromPublic(message._id)} className='btn btn-success'> اخفاء من العامة < FaEye style={{ cursor: 'pointer' }} size={15} /></button>
                    }
                    <button onClick={() => deleteMessage(message._id)} className='btn btn-danger'> حذف < FaTrash style={{ cursor: 'pointer' }} size={15} /></button>
                  </div>
                </div>
              )}
                </>
             :
                <><div className='mt-5 text-center'>
            <h1>   لا توجد اي رسائل في المفضلة </h1>
            <p> شارك اللينك مع اصدقائك ليصلك رسائلهم </p>
          </div></>}
                </> : <>  <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Spinner animation="border" role="status">
        <span className="visually-hidden"></span>
      </Spinner>
    </div> </>}
              
              </>:""}
              {activeTab=="sent"? <>
                {seendingMessages!=null? <>
                {seendingMessages?.length>0?
                <> 
                       <div className="messagecontinf mt-2">
                <h5>الرسائل المبعته: <span className='countmessags'>{seendingMessages?.length}</span></h5>
                <p>يتم ترتيب الرسائل من الحديثه للقديمه</p>
              </div>
              {seendingMessages?.map((message, i) =>
                <div className='contmessage text-dark mt-2' key={i}>
                  <div className="messagehead">
                    <p> 
                      {message.recievedId?
                       <><Link to={`/sendmessage/${message.recievedId._id}`}>{message?.recievedId?.name}</Link>{message.recievedId._id==userDataLocal.id?(" (انت) "):""} </>
                      :"الحساب غير متاح او اتحذف"}
                      : <span className='timemessage'>{timeAgo(message.createdAt)}</span> </p>
                   
                  </div>
                  <hr />
                  <p className='messagedata'>{message.messageText}</p>
                  <hr />
                  <p className='text-end  mt-3'>{message.seen?"شاهدها" : "لم يشاهدها"}</p>
                </div>
              )}
                </>
             :
                <><div className='mt-5 text-center'>
            <h1>   لا توجد اي رسائل في ارسلتها الي احد.. </h1>
            <p>  ادخل الي روابط اصدقائك وصارحهم </p>
          </div></>}
                </> : <>  <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Spinner animation="border" role="status">
        <span className="visually-hidden"></span>
      </Spinner>
    </div> </>}
              
              </>:""}
            



            </div>
          </div>
        </> : <>
          
        </>
      
      {/* Modal */}
      {showModal && (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              <div className="modal-header">
                <h5 className="modal-title">تأكيد إظهار الرسالة</h5>
              </div>
              <div className="modal-body">
                <p>هل أنت متأكد من أنك تريد إظهار الرسالة؟  يمكن اي شخص برويتها 

                </p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>لا</button>
                <button type="button" className="btn btn-primary" onClick={confirmShowMessage}>نعم</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal2 && (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }}>
          {whoSendData=="not"?
          <div className="modal-dialog">
            <div className="modal-content">
            <button type="button" className="btn-close" onClick={() => setShowModal2(false)}></button>
            <div className="modal-header">
                <h5 className="modal-title">  معلومات عن مرسل الرسالة</h5>
              </div>
               <div className="modal-body">
               <h2>  المستخدم الذي بعت الرسالة غير مسجل في الموقع او تم حذف حسابه</h2>
              </div>
              
  
            </div>
          </div>
          :<div className="modal-dialog">
            <div className="modal-content">
                <button type="button" className="btn-close" onClick={() => setShowModal2(false)}></button>
              <div className="modal-header">
                <h5 className="modal-title">  معلومات عن مرسل الرسالة</h5>
              </div>
              <div className="modal-body whosenddataa">
                <p> <span>الاسم</span> : {whoSendData.name} </p>
                <p> <span>النوع</span> : {whoSendData.gender=="male"?"ذكر":"انثى"} </p>
                <p> <span>السيرة الذاتيه</span> : {whoSendData.bio||"'لا توجد سيره ذاتيه لهذا المستخدم'"} </p>
                <p> <Link to={`/sendmessage/${whoSendData._id}`} className='btn btn-primary mt-3'> رؤيه الحساب </Link> </p>
              </div>
  
            </div>
          </div>}
          
        </div>
      )}
    </div>
  )
}
