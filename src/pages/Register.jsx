import React, { useContext, useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../context/context';

export default function Register() {
  const [errs, setErrs] = useState({});
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(null);
  const [userdata, setUserdata] = useState({
    name: "",
    email: "",
    password: "",
    repass: "",
    gender: ""
  });
  const[loading,setLoaing]=useState(false)
    const { Host } = useContext(MyContext);
  let go = useNavigate();

  // Updated schema for allowing Arabic characters and spaces in name
  const schema = Yup.object().shape({
    name: Yup.string()
      .matches(/^[\u0621-\u064A\u0660-\u0669a-zA-Z0-9_ ]*$/, 'إسم المستخدم يجب أن يحتوي فقط على حروف، أرقام، شرطات سفلية، ومسافات')
      .required('يرجي كتابه الاسم'),
    email: Yup.string().email('الايميل غلط').required('مطلوب كتابه الايميل'),
    password: Yup.string().min(6, 'على الاقل كلمه السر يجب عن تحتوي علي 6 حروف').required('يرجي كتابه كلمه السر'),
    repass: Yup.string()
      .oneOf([Yup.ref('password'), null], 'يجب ان يطابق كلمه السر الاولي')
      .required('يرجي كتابه تأكييد كلمه السر'),
    gender: Yup.string()
      .oneOf(['male', 'female'], 'يجب اختيار النوع (ذكر أو أنثى)')
      .required('يرجى كتابة النوع'),
  });

  const getData = (e) => {
    const newData = { ...userdata };
    newData[e.target.name] = e.target.value; // Allow spaces in input fields
    setUserdata(newData);
  };

  const handleSubmit = async (e) => {
    setLoaing(true)
    e.preventDefault();
    try {
      const cleanedData = {
        ...userdata,
        name: userdata.name.trim(), // Trim leading/trailing spaces for validation
        email: userdata.email.trim(),
        password: userdata.password.trim(),
        repass: userdata.repass.trim(),
        gender: userdata.gender
      };
      await schema.validate(cleanedData, { abortEarly: false });
      setErrs({});
      try {
        const data = {
          name: cleanedData.name,
          email: cleanedData.email,
          password: cleanedData.password,
          gender: cleanedData.gender
        };
        const response = await axios.post(`${Host}/api/v1/user/register`, JSON.stringify(data), {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.data.message === "success") {
          setErr(null);
          setUserdata({
            name: "",
            email: "",
            password: "",
            repass: "",
            gender: ""
          });
          setSuccess(` تم ارسال رساله  علي البريد الالكتروني'  ${data.email}' لتأكييد الدخول `);
        }
        if (response.data.err === "User Already Exist") {
          setSuccess("");
          setErr("هذا البريد الالكتروني متسخدم");
        }
        setLoaing(false)
      } catch (err) {
        setLoaing(false)
        if (err.response.data.err === "User Already Exist") {
          setSuccess("");
          setErr("هذا البريد الالكتروني متسخدم");
        }
      }
    } catch (error) {
      const validationErrors = {};
      error?.inner?.forEach(err => {
        validationErrors[err.path] = err.message;
      });
      setErr("");
      setErrs(validationErrors);
      setLoaing(false)
    }
    setLoaing(false)
  };

  return (
    <div className='loginpage'>
      <div className='container h-100'>
        <form onSubmit={handleSubmit} className='w-lg-75 w-sm-100 mx-auto mt-3 p-4 contform'>
          <h2>انشاء حساب جديد:</h2>
          {err && <p className='alert alert-danger'>{err}</p>}
          {success && <p className='alert alert-success'>{success}</p>}

          <label htmlFor="name" className='mt-2'>الاسم:</label>
          <input type="text" onChange={getData} value={userdata.name} name='name' className='form-control' />
          {errs.name && <div className="text-danger p-1">{errs.name}</div>}

          <label htmlFor="email" className='mt-2'>البريد الالكتروني:</label>
          <input type="text" onChange={getData} value={userdata.email} name='email' className='form-control' />
          {errs.email && <div className="text-danger p-1">{errs.email}</div>}

          <label htmlFor="password" className='mt-2'>كلمه السر:</label>
          <input type="password" value={userdata.password} onChange={getData} name='password' className='form-control' />
          {errs.password && <div className="text-danger p-1">{errs.password}</div>}

          <label htmlFor="repass" className='mt-2'>تأكيد كلمه السر:</label>
          <input type="password" value={userdata.repass} onChange={getData} name='repass' className='form-control' />
          {errs.repass && <div className="text-danger p-1">{errs.repass}</div>}

          <label htmlFor="gender" className='mt-2'>النوع:</label>
          <select onChange={getData} value={userdata.gender} name='gender' className='form-control'>
            <option value="">اختر النوع</option>
            <option value="male">ذكر</option>
            <option value="female">أنثى</option>
          </select>
          {errs.gender && <div className="text-danger p-1">{errs.gender}</div>}

          <button className='btn btn-primary mt-4' type='submit' > 
          {loading?<div class="spinner-border text-white" role="status">
  <span class="sr-only"></span>
</div>:"انشاءحساب"}
          </button>
        </form>
      </div>
    </div>
  );
}
