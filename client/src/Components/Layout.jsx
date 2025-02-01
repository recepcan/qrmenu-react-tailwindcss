import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Home from '../pages/Home'
import SignUp from '../pages/SignUp'
import SignIn from '../pages/SignIn'
import HotDrinks from '../pages/HotDrinks'
import ColdDrinks from '../pages/ColdDrinks'
import Sweets from '../pages/Sweets'
import Cookie from '../pages/Cookie'
import IntheBox from '../pages/IntheBox'
import PrivateRoute from './PrivateRoute'
import Panel from '../pages/AdminPages/Panel'
import OnlyAdminPrivateRoute from './OnlyAdminPrivateRoute'
import CreateProduct from '../pages/AdminPages/CreateProduct'
import CreateCategory from '../pages/AdminPages/CreateCategory'
import UpdateProduct from '../pages/AdminPages/UpdateProduct'
import UpdateCategory from '../pages/AdminPages/UpdateCategory'
import { useSelector } from 'react-redux';
import CurrentUser from '../pages/CurrentUser';
import UserProducts from '../pages/UserProducts';
import Error from './Error';
import CreateHome from '../pages/AdminPages/CreateHome';
import UpdateHome from '../pages/AdminPages/UpdateHome';
import Header from './Header';

function Layout() {
    
  return (
    <div>
   
    <Header/>
    <Routes>

    <Route path="/:username" element={<CurrentUser />} />
    <Route path="/:username/products" element={<UserProducts />} />
    
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sicak-icecekler" element={<HotDrinks />} />
        <Route path="/soguk-icecekler" element={<ColdDrinks />} />
        <Route path="/tatlilar" element={<Sweets />} />
        <Route path="/atistirmaliklar" element={<Cookie />} />
        <Route path="/inthebox" element={<IntheBox />} />

        <Route element={<PrivateRoute />}>
          <Route path='/panel' element={ <Panel />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
         <Route path='/create-product' element={<CreateProduct />} />
         <Route path='/create-category' element={<CreateCategory />} />
         <Route path='/create-home' element={<CreateHome />} />

        <Route path='/update-product/:productId' element={<UpdateProduct />} />
        <Route path='/update-category/:categoryId' element={<UpdateCategory />} />
        <Route path='/update-home/:homeId' element={<UpdateHome />} />
        </Route>

        <Route path="/" element={<SignUp />} />


        <Route path="*" element={<Error />} />

       

      </Routes>
   
    
    
    </div>
  )
}

export default Layout