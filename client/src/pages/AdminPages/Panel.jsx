import React from 'react'
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { signInFailure, signInSuccess, signoutSuccess } from '../../store/userSlice';
import { toast } from 'react-toastify';
// import AdminHomeComponent from './AdminHomeComponent';
// import AdminAboutComponent from './AdminAboutComponent';
// import AdminContactComponent from './AdminContactComponent';
// import AdminPostsComponent from './AdminPostsComponent';
// import AdminUpdatePostComponent from './UpdatePost';
// import AdminTextsComponent from './AdminTextsComponent';
import { AiOutlineMenu } from 'react-icons/ai';
import { IoCloseSharp } from 'react-icons/io5';
import Products from './DashProducts';
import Users from './Users';
import DashSidebar from './DashSidebar';
import DashProducts from './DashProducts';
import DashCategory from './DashCategory';
import DashHome from './DashHome';



function Panel() {
// const [adminMenu, setadminMenu] = useState(false)




  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser,adminMenu } = useSelector((state) => state.user);
  const [tab, setTab] = useState('home');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
      // console.log(tabFromUrl)
    }
  }, [location.search]);

  return (
    <div className='min-h-screen w-full  box-border 
     border-yellow-400 relative flex  sm:py-20 py-16 '>
     

    {
     
      <div 
      className={`${adminMenu? 'lg:w-1/5 max-sm:flex-1' : 'w-14 '} transition-all duration-200  border-gray-400  min-h-screen `}>
      <DashSidebar adminMenu={adminMenu} />
      </div>
    }


      <div className={`md:flex-1 ${adminMenu && "max-sm:hidden" } w-full 
        min-h-full box-border p-2 max-h-screen overflow-y-auto  dark:bg-gray-900
         border-black`} >
      
      
      {tab=== 'products' && (<DashProducts/>)}
      {tab=== 'users' && (<Users/>)}
      {tab=== 'category' && (<DashCategory/>)}
      {tab=== 'home' && (<DashHome/>)}
      {tab=== '' && (<DashHome/>)}
      </div>
    </div>
  )
}

export default Panel