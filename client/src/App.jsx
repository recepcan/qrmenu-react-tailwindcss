import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './Components/Layout';
import {BrowserRouter as  Router } from 'react-router-dom';
const App = () => {


  return (
    <div className="min-h-screen"
    >
    <Router>
    <Layout/>
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
      </Router>
    </div>
  );
};

export default App;
