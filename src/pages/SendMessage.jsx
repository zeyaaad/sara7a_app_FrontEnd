import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import styles
import { MyContext } from '../context/context';
import LoadingPage from '../components/LoadingPage';
import img from "./../components/userImg.jpeg"
import ButtonLoading from '../components/ButtonLoading';
export default function SendMessage() {
  let { id } = useParams();
  const [exist, setExist] = useState(null);
  const [userName, setUserName] = useState(null);
  let go = useNavigate();
  const [messageText, setMessageText] = useState("");
  const [err, setErr] = useState(null);
  const { Host,timeAgo } = useContext(MyContext);
  let [userData,setUserData]=useState(null)
  const[publicMessages,setPublicMessages]=useState(null)
  const token =localStorage.getItem("sara7a_token")
  const emojis = [
    '😀', '😅', '😂', '🤣', '🙂', '😍', '😘', '😭', '😢', '😎',
    '🤨', '😳', '💩', '😡', '😷', '👋', '💋', '🙈', '🌹', '❤️'
  ];
  let[loading,setLoading]=useState(false)
  let[vistors,setVistors]=useState(null);
  useEffect(() => {
    checkUser();
    if(id){
      getPublicMessages();
    }


    if(token){
      sendVistor()
    }
  }, []);

async function sendVistor(){
      try {
        let res=await axios.post(`${Host}/api/v1/vistor/add`,{
          profileId:id
        },{
          headers:{
            "token":token
          }
        })
        getNumber()
      } catch (error) {
        console.log(error)
      }
    }
async function getNumber(){
      try {
        let res=await axios.get(`${Host}/api/v1/vistor/getnumber/${id}`)
        setVistors(res.data.data)
      } catch (error) {
        console.log(error)
      }
    }

  async function checkUser() {
    if (!id) {
      go("/home");
    } else {
      try {
        let res = await axios.get(`${Host}/api/v1/user/checkUser/${id}`);
        setUserName(res.data.user.name);
        setUserData(res.data.user)
        setExist(true);
      } catch (error) {
        console.log("err to check user", error.response);
        if (error.response.status === 400) {
          setExist(false);
        }
      }
    }
  }



  async function sendMessage() {
    setLoading(true)
    if(!token && userData.typeSend===1){
      setLoading(false)
      return setErr("لا يمكنك ارسال رساله الي هذا المستخدم الا عندما تقوم بتسجيل الدخول في الموقع")
    }
    const pattern = /^[\p{L}\p{N}\s!,.?؛:؛،\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{1F004}\u{1F0CF}]{3,500}$/u;

    if (!pattern.test(messageText.trim())) {
      setErr("يجب أن تكون الرسالة بين 3 و500 حرف  فقط .");
      setLoading(false)
      return;
    }
    setErr(null);
    try {
      let data = {
        messageText: messageText.trim(),
        recievedId: id
      };
      let res=token? await axios.post(`${Host}/api/v1/message`, JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
            token:token

        }
      }):await axios.post(`${Host}/api/v1/message`, JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      if (res.data.message === "success") {
        toast.success("تم ارسال الرساله بنجاح", {
          position: "top-center",
        });
        setMessageText("");
      }
      setLoading(false)
    } catch (error) {
      if(error.response.stauts==401){
        setErr("لا يمكنك ارسال رساله الي هذا المستخدم الا عندما تقوم بتسجيل الدخول في الموقع")
      }
      console.log("err to send message", error);
      setLoading(false)
    }
  }



  

  const addEmoji = (emoji) => {
    setMessageText(prev => prev + emoji);
  };


  async function getPublicMessages(){
    try {
      let res=await axios.get(`${Host}/api/v1/message/public/${id}`)
        setPublicMessages(res.data.data)
    } catch (error) {
      console.log(error)
      toast.error("حدث خطا اثناء جلب الرسائل العلنية")
    }
  }



  return (
    <>
      <ToastContainer />
      <div className='sendmessagepage'>
        {exist !== null ? (
          <>
            {exist ? (
              <div className="container">
                <div className="message-page mt-5">
                <p> ارسل رساله الي سرية الي {userName}</p>
                  <img
                    src={img}
                    alt="User"
                    width={120}
                    className="userImg"
                  />
                <div className="user-info">
                  <div className="user-name d-block"> {userName}</div>
                </div>
                  <p className='userBio' > {userData.bio} </p>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={`هناك شئ تريد قوله ل ${userName} بدون ان يعرفك؟اكتب هنا..`}
                  rows="6"
                />
                {err && <p className='text-danger mb-3'> {err}</p>}
                
                <div className="emoji-picker">
                  {emojis.map((emoji, index) => (
                    <span
                      key={index}
                      className="emoji"
                      onClick={() => addEmoji(emoji)}
                      style={{ cursor: 'pointer', fontSize: '24px', margin: '5px' }}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
                    {userData.status!=0?<button onClick={sendMessage}> {loading?<ButtonLoading/>:"إرسال"} </button>:
                    <h5 className='mt-5 text-primary' > لا يمكنك ارسال رسايل الي {userData.name} لانه لا يسمح بتلقي رسايل في الوقت الحالي </h5>
                    }
                    {vistors!=null?<p className='mt-4 text-start numberofvistors' > عدد الزوار : {vistors} </p>:""}
              </div>
              {publicMessages!=null?<>
              
              
              {publicMessages.length>0?<>
              
               <div className="publicmessages">
                  <h5> الاراء اللتي سمح {userName} بمشاركتها: <span className='countmessags' >{publicMessages.length}</span>  </h5>
                  {publicMessages.map((message, i) =>
                <div className='contmessage text-dark mt-2 text-center' key={i}>
                  <div className="messagehead">
                    <p> مجهول: <span className='timemessage'>{timeAgo(message.createdAt)}</span> </p>
                    
                  </div>
                  <hr />
                  <p className='messagedata'>{message.messageText}</p>
                  <hr/>
                
                </div>
              )}
              </div>
              
              
              </>:<>
              <div className='publicmessages p-5 text-center  '>
              <h4> لا توجد رسائل عامه سمح {userName} بمشاركتها </h4>
              </div>
              </>}
              </>:<> <LoadingPage/> </>}
             
              </div>
              
            ) : (
              <div className="text-center mt-5">
                <h1>404</h1>
                <h3> لم يتم العثور على هذا المستخدم </h3>
                <Link to="/home"> العوده الصفحه الرئيسيه </Link>
              </div>
            )}
          </>
        ) : (
          <LoadingPage/>
        )}
      </div>
    </>
  );
}
