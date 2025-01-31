import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom'
import { setadminMenu, signoutSuccess } from '../../store/userSlice';
import { toast } from 'react-toastify';
import { FaPlus, FaSignOutAlt, FaUser, FaUsers } from 'react-icons/fa';
import { MdCreateNewFolder } from "react-icons/md";
import { BiSolidCategory } from 'react-icons/bi';
import { CgWebsite } from 'react-icons/cg';

function DashSideBar({ adminMenu }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState('home');
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

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

  const tabs = [
    {
      title: 'profile',
      icon: <FaUser />,
    },
    {
      title: "products",
      icon: <MdCreateNewFolder />,
      submenu: [
        { title: "All Products", link: "/panel?tab=products" },
        { title: "New Product", link: "/create-product" }
      ]
    },
    currentUser?.isOwner && 
    { title: "users", icon: <FaUsers /> },
    {
      title: "category",
      icon: <BiSolidCategory />,
      submenu: [
        { title: "All Categories", link: "/panel?tab=category" },
        { title: "New Category", link: "/create-category" }
      ]
    },
    {
      title:'My Page',
      icon:<CgWebsite />,
      to:currentUser.username
    }
  ].filter(Boolean);

  return (
    <div className='w-full h-16 px-5  shadow-md shadow-gray-400 transition-all duration-300 bg-gray-200 dark:bg-gray-800 flex justify-between space-x-2 dark:shadow-none'>

      {/* Navbar Sol Tarafı */}
      <div className='flex space-x-2 items-center relative'>
        {tabs.map((item, index) => (
          <div 
            key={index} 
            className="relative"
            onMouseEnter={() => setOpenDropdown(item.title)}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <Link
              className={`${tab === item.title ? 'dark:text-white bg-sky-700 dark:bg-sky-500 text-white font-extrabold' : ''}
                h-12 border border-gray-500 rounded-lg p-2 space-x-2 shadow-sm md:hover:bg-sky-900 md:hover:text-white
                flex items-center justify-start text-lg font-extrabold`}
              to={item.to? `/${item.to}` : `/panel?tab=${item.title}`}
            >
              <div className={`text-xl `}>{item.icon}</div>
              <h1 className={`max-md:hidden text-sm`}>{item.title}</h1>
            </Link>

            {/* Dropdown Menü */}
            {item.submenu && openDropdown === item.title && (
              <div className="absolute left-0 top-full  z-40 bg-white dark:bg-gray-800 border rounded-lg shadow-lg w-48">
                {item.submenu.map((subItem, subIndex) => (
                  <Link
                    key={subIndex}
                    to={subItem.link}
                    className="block px-4 py-3 rounded-lg text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navbar Sağ Tarafı */}
      <div className="flex-1 flex flex-row justify-end space-x-2 items-center    p-2">
      
      {
        <Link 
        to={tab === 'category' ? '/create-category' : '/create-product'} 
        className={`${tab !== 'category' && tab !== 'products' ? 'hidden' : 'border border-gray-500 p-2 rounded-lg h-12 flex items-center justify-center space-x-2 font-bold hover:bg-green-700'}`}
      >
        <FaPlus />
        <h1 className='max-md:hidden'>{tab === 'category' ? 'Add category' : 'Add product'} </h1>
      </Link>
      }
      
      {location.pathname === '/panel' &&
          <button onClick={handleSignout} className='hover:bg-red-600 h-12 border font-semibold p-2 rounded-lg border-gray-500'>
            <FaSignOutAlt />
          </button>
        }
        
      </div>

    </div>
  )
}

export default DashSideBar;
