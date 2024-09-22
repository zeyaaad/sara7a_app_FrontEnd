import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';
import { MyContext } from '../context/context';
import ButtonLoading from '../components/ButtonLoading';

export default function ForgetEmail() {
    const[email,setEmail]=useState(null)

  const[loading,setLoading]=useState(false)
     const [error, setError] = useState('');
  const[errs,seterrs]=useState({})
    const {Host } = useContext(MyContext);
    const[success,setSuccess]=useState(null)
    let go=useNavigate();
     const schema=Yup.object().shape({
        email:Yup.string().required("يرجي كتابه البريد الالكتروني").matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"يرجي بريد الالكتروني صحيح "),
    });


  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
      try {
            await schema.validate({"email":email.trim()},{abortEarly:false});
            seterrs({});
              try {
                 const response = await axios.post(`${Host}/api/v1/user/forgot-password`,
                 JSON.stringify({email:email.trim()}) , {
                      headers: {
                    'Content-Type': 'application/json',
                    }
                 });
                 if(response.data.message="Password reset email sent"){
                  seterrs({})
                  setError("")
                  setSuccess(`لقد قمنا بارسال رابط تغير الباسورد علي   ${email}`)
                  setEmail("")
                  setLoading(false)
                 }
              } catch(err) {
                  console.log(err)
                if(err.response.data.message==="User not found"){
                  setSuccess("")
                  setError("لا يوجد حساب بهذا البريد");
                    setLoading(false)

                }
              }

        } catch (validationErrors) {
            var errors={}
            validationErrors?.inner?.forEach(err => {
                errors[err.path]=err.message;
                
            });
            seterrs(errors)
            setLoading(false)
            setSuccess("")
            
        }
        setLoading(false)

  };


  return (
      <div className="loginpage">
      <div className="container">
        <form className='w-md-50 w-sm-100  p-4 formforgetpass mx-auto mt-5' onSubmit={handleSubmit}>
      <h2>  تذكر كلمه السر </h2>
            {error && <p className='alert alert-danger'>{error}</p>}
            {success && <p className='alert alert-success'>{success}</p>}

      <label className='mt-3' htmlFor=""> اكتب بريدك الالكتروني لكي نرسلك لك عليه رابط تغير كلمة السر</label>
      <input className='form-control '
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
        {errs.email &&<p className='text-danger'>{errs.email}</p>}
    
      <button className='btn btn-primary mt-5' type="submit">  {loading?
      <ButtonLoading/>
: "ارسال"}</button>
    </form>
      </div>
    </div>  
  )
}
