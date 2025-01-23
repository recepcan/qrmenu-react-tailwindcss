import React from 'react';
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
import CreateCategory from './pages/AdminPages/CreateCategory';
import UpdateCategory from './pages/AdminPages/UpdateCategory';
import Layout from './Components/Layout';
const App = () => {


  return (
    <div className="h-screen bg-cover  bg-center bg-no-repeat bg-[#031714] "
    style={{
      backgroundImage: `url(${anaekranfoto})`, // Doğru kullanım
    }}>
    
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
    </div>
  );
};

export default App;
