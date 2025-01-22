import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
const App = () => {
  return (
    <div className="h-screen bg-cover  bg-center bg-no-repeat bg-[#031714] "
    style={{
      backgroundImage: `url(${anaekranfoto})`, // Doğru kullanım
    }}>
    
    <Router>
    <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sicak-icecekler" element={<HotDrinks />} />
        <Route path="/soguk-icecekler" element={<ColdDrinks />} />
        <Route path="/tatlilar" element={<Sweets />} />
        <Route path="/atistirmaliklar" element={<Cookie />} />
        <Route path="/inthebox" element={<IntheBox />} />
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
