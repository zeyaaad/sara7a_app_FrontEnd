import React, { useContext } from 'react'
import { MyContext } from '../context/context';
import { Link } from 'react-router-dom';
export default function Navbar() {

  const {checkauth,isLogIn,logOut } = useContext(MyContext);

  return (
            <nav className="navbar navbar-expand-lg navbar-dark  bg-dark">
            <div className="container">
                <Link   className="navbar-brand ms-auto" to="/messages" > صارحني  </Link>


                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="تبديل التنقل">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    {isLogIn?
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link  className="nav-link" to="/messages" > رسائلي</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/settings" >   الاعدادات   </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contact" >   تواصل معنا   </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/search" >    البحث   </Link>
                        </li>

                        <li className="nav-item">
                            <button className='nav-link' onClick={logOut} >تسجيل خروج</button>
                        </li>
                    </ul>
                    :
                    <ul className="navbar-nav ms-auto">

                        <li className="nav-item">
                            <Link  className="nav-link" to="/login" > تسجيل دخول </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/register" > انشاء حساب جديد   </Link>
                        </li>
                    </ul>
                    }
                    
                </div>
            </div>
        </nav>
  )
}
