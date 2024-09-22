import React, { useContext, useState } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { MyContext } from '../context/context';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function ContactPage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
      const{Host}=useContext(MyContext)
    let[loading,setLoading]=useState(false)
      const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    if (message.length < 5 || message.length > 150) {
      setError('يجب ان تكون الرسال ما بين 5 الي 150 حرف');
    } else {
      setError('');
      try {
        let res=await axios.post(`${Host}/api/v1/contact/add`,{messageText:message},{
            headers:{
                "token":localStorage.getItem("sara7a_token")
            }
        })
        toast.success("تم ارسال الرسالة بنجاح , شكرا علي تواصلك معنا")
        setLoading(false)
      } catch (error) {
        console.log(error)
        toast.error("خطأ في ارسال الرساله حاول في وقت لاحق")
        setLoading(false)
      }
      setLoading(false)
      setMessage('');
    }
    setLoading(false)
  };

  return (
    <div>
      <Header />
      <div className="contactcont mt-1">
        <h2>ما اللذي تريد ان تخبرنا عنه؟</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <textarea
              id="message"
              className="form-control"
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {error && <small className="text-danger">{error}</small>}
          </div>
          <button type="submit" className="btn btn-primary">ارسال </button>
        </form>
      </div>
    </div>
  );
}
