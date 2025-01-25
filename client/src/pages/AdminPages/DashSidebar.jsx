import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useLocation } from 'react-router-dom'
import { setadminMenu, signoutSuccess } from '../../store/userSlice';
import { toast } from 'react-toastify';
import { AiFillLeftCircle, AiOutlineMenu } from 'react-icons/ai';
import { TiHome } from "react-icons/ti";
import { FcAbout } from "react-icons/fc";
import { MdContentPaste, MdCreateNewFolder, MdHomeRepairService } from "react-icons/md";
import { PiPhoneDisconnectThin } from "react-icons/pi";
import { IoCloseSharp, IoDocumentText, IoDocumentTextSharp } from "react-icons/io5";
import { FaImages, FaPhoneFlip } from 'react-icons/fa6';
import { FaInfoCircle, FaMoon, FaUsers } from 'react-icons/fa';
import { BiSolidCategory, BiSolidSun } from 'react-icons/bi';
import { BsPersonCircle } from "react-icons/bs";
import { GrTextWrap } from "react-icons/gr";

function DashSideBar({adminMenu}) {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState('home');
  
   const handleSignout = async () => {
    try {
      const res = await fetch('/server/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      toast.error(error)
    }
  };
  console.log(tab)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
      // console.log(tabFromUrl)
    }
  }, [location.search]);



  const tabs = [
    {
      title: "home",
      icon: <TiHome />
    },
    // {
    //   title: "about",
    //   icon: <FaInfoCircle />

    // },
    // {
    //   title:"publications",
    //   icon:<IoDocumentTextSharp />
    // }
    // ,
    // {
    //   title: "services",
    //   icon: <MdHomeRepairService />

    // },
    {
      title: "products",
      icon: <MdCreateNewFolder />
    },
    {
      title:"users",
      icon:<FaUsers />
    },
    {
      title:"category",
      icon:<BiSolidCategory />
    }
    // {
    //   title: "texts",
    //   icon: <GrTextWrap />

    // },
    // {
    //   title:"galeri",
    //   icon:<FaImages />

    // },
    // {
    //   title: "contact",
    //   icon: <FaPhoneFlip />
    // },

    
   
   

  ];



  // console.log(currentUser.isAdmin)
  return (
    <div className='w-full h-[90%]   shadow-xl shadow-gray-400 transition-all duration-300
      border-white overflow-hidden  bg-gray-200 dark:bg-gray-800
         flex  flex-col justify-between   space-y-5  dark:shadow-none '>


      <div className='flex flex-col  relative pt-14'>
      <div
      onClick={()=>dispatch(setadminMenu())} 
      className=' cursor-pointer flex 
       items-center justify-center rounded-lg text-4xl w-10 h-10 absolute top-2 right-2 '>
      {
        adminMenu  ? 
       <IoCloseSharp />
       :
       <AiOutlineMenu/>
      }
      </div>

        {
          tabs.map((item, index) => (
            <Link
             key={index} 
             className={`${tab === item.title && 'dark:text-white  bg-sky-700 dark:bg-sky-500 text-white  font-extrabold'}
               w-full
               rounded-none p-4 space-x-5  shadow-sm   md:hover:bg-sky-900 md:hover:text-white 
                 flex items-center  justify-start    text-xl font-extrabold`}
              to={`/panel?tab=${item.title}`}>
              <div className='text-2xl'>{item.icon}</div>
             { 
              <h1 className={`${adminMenu? 'visible' : 'hidden'}`}>{item.title}</h1>
            }
            </Link>
          ))
        }
        

      </div>

      <div className={`flex ${adminMenu? 'flex-row':'flex-col space-y-3'} items-center justify-between text-gray-900 dark:text-gray-400   p-2 `}>
        {location.pathname == '/panel' &&
          <button onClick={handleSignout} className='  text-white  bg-red-500  font-semibold p-1 rounded-full'>
            <AiFillLeftCircle className='text-3xl ' />
          </button>
        }
        <Link to={'/'} className='  '>
          <h6 className={`flex ${adminMenu? 'text-md':'hidden'} `}>
         @{currentUser?.email.split("@")[0]}
          </h6>
        </Link>
      {/* <Link  to={`/admin?tab=profile`}>
       <img src={currentUser?.profilePicture} className='w-8 h-8 object-cover rounded-full ' />
       </Link> */}
      </div>

    </div>
  )
}
export default DashSideBar