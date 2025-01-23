import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import HotDrinks from './pages/HotDrinks';
import ColdDrinks from './pages/ColdDrinks';
import Sweets from './pages/Sweets';
import Cookie from './pages/Cookie';
import anaekranfoto from '../src/assets/anaekran-foto.jpg';
import Header from './Components/Header';
import IntheBox from './pages/IntheBox';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import PrivateRoute from './Components/PrivateRoute';
import OnlyAdminPrivateRoute from './Components/OnlyAdminPrivateRoute';
import Panel from './pages/AdminPages/Panel';
import CreateProduct from './pages/AdminPages/CreateProduct';
import UpdateProduct from './pages/AdminPages/UpdateProduct';
const App = () => {


  return (
    <div className="h-screen bg-cover  bg-center bg-no-repeat bg-[#031714] "
    style={{
      backgroundImage: `url(${anaekranfoto})`, // Doğru kullanım
    }}>
    
    <Router>
    <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sicak-icecekler" element={<HotDrinks />} />
        <Route path="/soguk-icecekler" element={<ColdDrinks />} />
        <Route path="/tatlilar" element={<Sweets />} />
        <Route path="/atistirmaliklar" element={<Cookie />} />
        <Route path="/inthebox" element={<IntheBox />} />

        <Route element={<PrivateRoute />}>
          <Route path='/panel' element={<Panel />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
         <Route path='/create-product' element={<CreateProduct />} />
        <Route path='/update-product/:productId' element={<UpdateProduct />} />
        </Route>


      </Routes>
    </Router>
    <ToastContainer 
        position="bottom-center"  // Bildirim alttan gelecek şekilde ayarlandı
        autoClose={1500}           // 3 saniye sonra kapanacak
        hideProgressBar={false}    // İlerleme çubuğu görünmeye devam edecek
        newestOnTop={false}        // Yeni bildirimler altta gösterilecek
        closeOnClick
        pauseOnHover
        draggable
        theme="light"              // Tema olarak light seçildi
      />
    </div>
  );
};

export default App;
