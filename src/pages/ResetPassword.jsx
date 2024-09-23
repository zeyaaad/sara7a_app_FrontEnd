import React, { useEffect,useContext, useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { Link, useNavigate,useParams } from 'react-router-dom';
import { MyContext } from '../context/context';
import LoadingPage from './../components/LoadingPage';
import { AiOutlineArrowLeft } from 'react-icons/ai'; // For back arrow icon
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import styles
import ButtonLoading from './../components/ButtonLoading';
export default function ResetPassword() {
    const{token}=useParams();
  const { Host } = useContext(MyContext);
  let go = useNavigate();
    const[trueToken,setTrueToken]=useState(null)
  const[loading,setLoading]=useState(false)

  useEffect(()=>{
    checkToken()
  },[])



    async function checkToken(){
        if(!token){
            go("/login")
        }
        try {
            let res=await axios.get(`${Host}/api/v1/user/check-resetToken/`,{
                headers:{
                    token:token
                }
            })
            if(res.data.message==true){
                setTrueToken(true)
            } else {
                setTrueToken(false)
            }
        } catch(error) {
            setTrueToken(false)
        }
    }




   const [errs, setErrs] = useState({});
  const [err, setErr] = useState("");
  const [userdata, setUserdata] = useState({
    password: "",
    repass: "",
  });

  const schema = Yup.object().shape({
    password: Yup.string().min(6, 'على الاقل كلمه السر يجب عن تحتوي علي 6 حروف').required('يرجي كتابه كلمه السر'),
    repass: Yup.string()
      .oneOf([Yup.ref('password'), null], 'يجب ان يطابق كلمه السر الاولي')
      .required('يرجي كتابه تأكييد كلمه السر'),

  });

  const getData = (e) => {
    const newData = { ...userdata };
    newData[e.target.name] = e.target.value; 
    setUserdata(newData);
  };

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    try {
      const cleanedData = {
        ...userdata,
        password: userdata.password.trim(),
        repass: userdata.repass.trim(),
      };
      await schema.validate(cleanedData, { abortEarly: false });
      setErrs({});
      try {
        const data = {
          newPassword: cleanedData.password,
        };
        const response = await axios.post(`${Host}/api/v1/user/reset-password/`, JSON.stringify(data), {
          headers: {
            'Content-Type': 'application/json',
            "token":token
          }
        });
        console.log(response)
        toast.success("تم تغيير كلمة السر بنجاح")
        
        setUserdata({
    password: "",
    repass: "",
  })
  setLoading(false)
      } catch (err) {
        setErr(err.response.data.message)
        setLoading(false)
      }
      setLoading(false)
    } catch (error) {
      const validationErrors = {};
      error?.inner?.forEach(err => {
        validationErrors[err.path] = err.message;
      });
      setErr("");
      setErrs(validationErrors);
      setLoading(false)
    }
  };

  return (
    <div className="loginpage">
         <div className='formforgetpass'>
        <ToastContainer/>
        {trueToken!=null?<>
        
        {trueToken?<>
        <div className='container h-100'>
        <form onSubmit={handleSubmit} className='w-lg-50 w-sm-100 mx-auto mt-3 p-4 '>
          <h2> تغيير كلمة السر</h2>
          {err && <p className='alert alert-danger'>{err}</p>}


          <label htmlFor="password" className='mt-2'>كلمه السر:</label>
          <input type="password" value={userdata.password} onChange={getData} name='password' className='form-control' />
          {errs.password && <div className="text-danger p-1">{errs.password}</div>}

          <label htmlFor="repass" className='mt-2'>تأكيد كلمه السر:</label>
          <input type="password" value={userdata.repass} onChange={getData} name='repass' className='form-control' />
          {errs.repass && <div className="text-danger p-1">{errs.repass}</div>}

            <button type="submit"  className='btn btn-primary mt-4' > {loading?<ButtonLoading/>:"تغيير"}   </button>

            <Link className='backloginbtn' to="/login" >   <AiOutlineArrowLeft style={{ marginRight: '8px' }} /> العودة الي صفحه تسجيل الدخول </Link>
        </form>
      </div>
        
        </>:<div className='mx-auto mt-5 p-5 text-center' >
            <h3> Invalid or expired token</h3>
            <h1>  قم باعاده ارسال الايميل مره اخري </h1>
      </div>}
            
        </>:<><LoadingPage/></>}
      
    </div>
    </div>
   
  );
}
