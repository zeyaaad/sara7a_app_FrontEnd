import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap JS (with Popper)
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import Login from './pages/Login';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { MyContext } from './context/context';
import LoadingPage from './components/LoadingPage';
import SendMessage from './pages/SendMessage';
import Messages from './pages/Messages';
import Footer from './components/Footer';
import ForgetEmail from './pages/ForgetEmail';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';
import Settings from './pages/Settings';
import Personalinfo from './pages/Personalinfo';
import PrivacySetting from './pages/PrivacySetting';
import SearchPage from './pages/SearchPage';
import ContactPage from './pages/ContactPage';
import Order from './pages/Order';
import Verfiy from './pages/Verfiy';
function App() {
  const {checkauth,isLogIn,ProtectAuth,ProtectRoute } = useContext(MyContext);

  useEffect(()=>{
    checkauth()
  },)


  return (
    
    <div  className='w-100 allappp'>

    {isLogIn!=null?<>
       <Navbar/>

       <Routes>
      {/* Auth Routes*/}
        <Route path="/register" element={ <ProtectAuth> <Register/>  </ProtectAuth> } />
        <Route path="/login" element={<ProtectAuth><Login/> </ProtectAuth>} />   
        <Route path="/forgetPassword" element={<ProtectAuth><ForgetEmail/> </ProtectAuth>} />   
        <Route path="/reset-password/:token" element={<ProtectAuth><ResetPassword/> </ProtectAuth>} />   
        <Route path="/verify/:token" element={<ProtectAuth><Verfiy/> </ProtectAuth>} />   


      {/* Protected Routes  */}
        <Route path="/" element={  <ProtectRoute> <Messages/>  </ProtectRoute> }  />
        <Route path="/messages" element={  <ProtectRoute> <Messages/>  </ProtectRoute> }  />
        <Route path="/settings" element={  <ProtectRoute> <Settings/>  </ProtectRoute> }  />
        <Route path="/personalinfo" element={  <ProtectRoute> <Personalinfo/>  </ProtectRoute> }  />
        <Route path="/privacysettings" element={  <ProtectRoute> <PrivacySetting/>  </ProtectRoute> }  />
        <Route path="/search" element={  <ProtectRoute> <SearchPage/>  </ProtectRoute> }  />
        <Route path="/contact" element={  <ProtectRoute> <ContactPage/>  </ProtectRoute> }  />
        <Route path="/order" element={  <ProtectRoute> <Order/>  </ProtectRoute> }  />



      {/* sharable routes  */}
        <Route path="/sendmessage" element={  <SendMessage/>  }  > 
          <Route path=":id" element={  <SendMessage/>  }/>
        </Route>
        
        <Route path="/*" element={  <ProtectRoute> <NotFound/>  </ProtectRoute> }  />
    </Routes>
    
    </>:<>
    <LoadingPage/>
    
    </>}
  
  




    </div>

  );
}

export default App;
