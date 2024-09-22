import React, { useContext, useEffect, useState } from 'react';
import Header from './../components/Header';
import axios from 'axios';
import { MyContext } from '../context/context';
import LoadingPage from '../components/LoadingPage';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ButtonLoading from '../components/ButtonLoading';
import img from "./../components/userImg.jpeg"
import { Link } from 'react-router-dom';

export default function Personalinfo() {
  const [userData, setUserData] = useState(null);
  const [userMainData, setMaindata] = useState({ name: '', gender: '', bio: '' });
  const [errors, setErrors] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    password: '',
    rePassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  let[vistors,setVistors]=useState(null)
  const token = localStorage.getItem("sara7a_token");
  const { Host,timeAgo } = useContext(MyContext);
  let[loading,setLoading]=useState(false)
  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(/^[\p{L}\p{N} ]+$/u, 'يجب أن يحتوي الاسم على أحرف عربية أو إنجليزية، أرقام ومسافات فقط')
      .required('الاسم مطلوب'),
    gender: Yup.string()
      .oneOf(['male', 'female'], 'يجب أن يكون الجنس ذكر أو أنثى فقط')
      .required('الجنس مطلوب')
  });

  const passwordValidationSchema = Yup.object({
    currentPassword: Yup.string().required('كلمة المرور الحالية مطلوبة'),
    password: Yup.string()
      .min(6, 'يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل')
      .required('كلمة المرور الجديدة مطلوبة'),
    rePassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'كلمات المرور غير متطابقة')
      .required('تأكيد كلمة المرور مطلوب')
  });

  const validateForm = async () => {
    try {
      await validationSchema.validate(userMainData, { abortEarly: false });
      return true;
    } catch (err) {
      const newErrors = {};
      err.inner.forEach(error => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
  };
async function getNumber(id){
      try {
        let res=await axios.get(`${Host}/api/v1/vistor/getnumber/${id}`)
        setVistors(res.data.data)
      } catch (error) {
        console.log(error)
      }
    }

  const validatePasswordForm = async () => {
    try {
      await passwordValidationSchema.validate(passwordData, { abortEarly: false });
      return true;
    } catch (err) {
      const newErrors = {};
      err.inner.forEach(error => {
        newErrors[error.path] = error.message;
      });
      setPasswordErrors(newErrors);
      return false;
    }
  };

  async function getData() {
    try {
      const res = await axios.get(`${Host}/api/v1/user/alldata`, {
        headers: { token }
      });
      setUserData(res.data.data);
      setMaindata({
        name: res.data.data?.name || '',
        gender: res.data.data?.gender || '',
        bio: res.data.data?.bio || '',
      });
      getNumber(res.data.data._id)
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    const isValid = await validateForm();
    if (isValid) {
      try {
        const res = await axios.put(`${Host}/api/v1/user/changedata`, userMainData, {
          headers: { token }
        });
        if (res?.data?.message === "success") {
          toast.success("تم حفظ التغييرات بنجاح");
          getData();
        } else {
          toast.error("حدث خطأ في حفظ التغييرات حاول مره اخري");
        }
        setErrors({});
        setLoading(false)
      } catch (error) {
        toast.error("حدث خطأ في حفظ التغييرات حاول مره اخري");
        console.log(error);
        setLoading(false)
      }
    } else {
      console.log('Form validation failed');
      setLoading(false)
    }
    setLoading(false)
  };

  const handlePasswordChange = async () => {
    setLoading(true)
    const isValid = await validatePasswordForm();
    if (isValid) {
      try {

        const res = await axios.put(`${Host}/api/v1/user/changepass`, passwordData, {
          headers: { token }
        });
        if (res?.data?.message === "success") {
          toast.success("تم تغيير كلمة المرور بنجاح");
          setPasswordData({ currentPassword: '', password: '', rePassword: '' });
          setPasswordErrors({});
        } else {
          toast.error("حدث خطأ في تغيير كلمة المرور، حاول مره اخرى");
        }
        setLoading(false)
      } catch (error) {
        if (error.response?.data?.err === "Wrong Current Password") {
          toast.error("كلمه السر الحالية خاطئه");
          setPasswordErrors({
            currentPassword: 'كلمه السر الحالية خاظئه',
            password: '',
            rePassword: ''
          });
        } else {
          toast.error("حدث خطأ في تغيير كلمة المرور، حاول مره اخرى");
        }
        setLoading(false)
      }
    } else {
      console.log('Password form validation failed');
      setLoading(false)
    }
  };

  useEffect(() => {
    getData();
  }, []);

  let[allVistors,setAllVistors]=useState(null)
  async function showVistors(){
    if(userData.type!=="pro"){
      return toast.error("يجب عليك ان ترقي حسابك لرؤيه زوار صفحتك")
    }
    try {
        let res=await axios.get(`${Host}/api/v1/vistor/getall`,{
          headers:{
            "token":token
          }
        })
        setAllVistors(res.data.data.reverse());
        setShowModal(true)
      } catch (error) {
        console.log(error)
      }
  }

  const [showModal, setShowModal] = useState(false);  // Track modal visibility
  const handleShowClick = () => {
    setShowModal(true);
  };



  return (
    <div className='container'>
      <Header />
      {userMainData && userData ? (
        <>
          <div className="maindata">
            <h3>المعلومات الشخصيه</h3>
            <input
              onChange={(e) => setMaindata({ ...userMainData, name: e.target.value })}
              type="text"
              name='name'
              value={userMainData.name}
              placeholder='اسمك او لقبك'
              className={`form-control mt-2 mb-1 ${errors.name ? 'is-invalid' : ''}`}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}

            <select
              onChange={(e) => setMaindata({ ...userMainData, gender: e.target.value })}
              name="gender"
              value={userMainData.gender}
              className={`form-control mt-1 mb-1 ${errors.gender ? 'is-invalid' : ''}`}
            >
              <option value="male">ذكر</option>
              <option value="female">انثى</option>
            </select>
            {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}

            <textarea
              onChange={(e) => setMaindata({ ...userMainData, bio: e.target.value })}
              name="bio"
              className={`form-control ${errors.bio ? 'is-invalid' : ''}`}
              cols="20"
              rows="10"
              value={userMainData.bio}
            />
            {errors.bio && <div className="invalid-feedback">{errors.bio}</div>}

            <button className='btn btn-primary mt-3' onClick={handleSubmit}>
              {loading?<ButtonLoading/>:"حفظ التغييرات"}
               
            </button>
            <hr />
            <div>
              {vistors!=null?<p> عدد زوار الصفحة : {vistors} </p> :""} 
              <button onClick={showVistors} className='btn btn-info'> رؤيه الزوار </button>
            </div>
          </div>

          <div className="maindata mt-1">
            <h3>تغيير كلمة المرور</h3>
            <input
              type="password"
              name="currentPassword"
              placeholder="كلمة المرور الحالية"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className={`form-control mt-2 mb-1 ${passwordErrors.currentPassword ? 'is-invalid' : ''}`}
            />
            {passwordErrors.currentPassword && <div className="invalid-feedback">{passwordErrors.currentPassword}</div>}

            <input
              type="password"
              name="password"
              placeholder="كلمة المرور الجديدة"
              value={passwordData.password}
              onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
              className={`form-control mt-2 mb-1 ${passwordErrors.password ? 'is-invalid' : ''}`}
            />
            {passwordErrors.password && <div className="invalid-feedback">{passwordErrors.password}</div>}

            <input
              type="password"
              name="rePassword"
              placeholder="تأكيد كلمة المرور"
              value={passwordData.rePassword}
              onChange={(e) => setPasswordData({ ...passwordData, rePassword: e.target.value })}
              className={`form-control mt-2 mb-1 ${passwordErrors.rePassword ? 'is-invalid' : ''}`}
            />
            {passwordErrors.rePassword && <div className="invalid-feedback">{passwordErrors.rePassword}</div>}

            <button className='btn btn-primary mt-3' onClick={handlePasswordChange}>
              {loading?<ButtonLoading/>:"تغيير"}
            </button>
          </div>
        </>
      ) : (
        <LoadingPage />
      )}


            {/* Modal */}
      {showModal && (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              <div className="modal-header">
                <h5 className="modal-title">  زوار صفحتك</h5>
              </div>
              <div className="modal-body">
              <ul className='allvistors'>
              {allVistors.map((user)=>
              <>
              <li>
                <div>
                  <img src={img} alt="" width={50} />
                  <span> {user.vistorId.name} </span>
                </div>
                <div>
                  <Link to={`/sendmessage/${user.vistorId._id}`} className='btn btn-primary' > رؤيه الحساب </Link >
                </div>
              </li>
              <span className='time' > {timeAgo(user.createdAt)} </span>
              <hr />
              </>
              )}

              </ul>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
