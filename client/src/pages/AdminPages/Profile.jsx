import { Button, FileInput, Label, TextInput,Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import { FaCheck, FaTimes } from "react-icons/fa";
function Profile() {
  const { currentUser } = useSelector((state) => state.user);

  const [file, setFile] = useState(null);
  const [users, setUsers] = useState([]);
  const [category, setCategory] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategory, setTotalCategory] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthProducts, setLastMonthProducts] = useState(0);
  const [lastMonthCategory, setLastMonthCategory] = useState(0); 

const [formData,setFormData]=useState({}) 

useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await fetch(`/server/user/${currentUser._id}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }
      if (res.ok) {
        setFormData(data);
       console.log(data)
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  fetchUser();
}, [currentUser]);

console.log(formData)



  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/server/user/getusers?limit=5');
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchProducts = async () => {
      try {
        let res =null
        if(currentUser.isOwner )  
           { 
            res = await fetch('/server/product/getproducts?limit=5');       
           }
          else {
            res = await fetch(`/server/product/getproducts?userId=${currentUser._id}`);
          } 
       
        const data = await res.json();
        if (res.ok) {
          setProducts(data.products);
          setTotalProducts(data.totalProducts);
          setLastMonthProducts(data.lastMonthProducts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchCategory = async () => {
      try {
        let res =null
        if(currentUser.isOwner )  
           { 
            res = await fetch('/server/category/getcategory?limit=5');       
           }
          else {
            res = await fetch(`/server/category/getcategory?userId=${currentUser._id}`);
          } 
       
        const data = await res.json();
        if (res.ok) {
          setCategory(data.category);
          setTotalCategory(data.totalCategory);
          setLastMonthCategory(data.lastMonthCategory);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
      fetchProducts();
      fetchCategory();
    }
  }, [currentUser]);


const handleImageUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload.');
      return null;
    }
  
    try {
      const imageData = new FormData();
      imageData.append('file', file); // Dosyayı FormData'ya ekliyoruz
      imageData.append('upload_preset', 'userImage'); // Cloudinary için preset değeri
  
      const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: imageData, // FormData gönderimi
      });
  
      const cloudinaryData = await cloudinaryRes.json();
  
      if (!cloudinaryRes.ok) {
        toast.error('Image upload failed.');
        return null;
      }
  
      toast.success('Image uploaded successfully!');
      setFormData({...formData,profilePicture:cloudinaryData.secure_url}) // Yüklenen görselin URL'sini döndür
    } catch (error) {
      toast.error('Something went wrong during image upload.');
      console.error(error);
      return null;
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/server/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      if (res.ok) {
       console.log(res)
      toast.success('User Updated Successfuly')
      }
    } catch (error) {
      toast.error(error);
    }
  };


  return (
    <div className="w-full min-h-screen flex sm:flex-row flex-col max-sm:space-y-5   items-start justify-center  p-4  ">

      <div className="sm:w-80 w-full sm:sticky top-5  max-sm:px-3
      left-0">
      <form 
      onSubmit={handleSubmit}
      className="w-full  dark:border border-gray-400  bg-gray-100 dark:bg-gray-800 rounded-lg p-5 space-y-5 shadow-md shadow-gray-400  
      dark:shadow-none
      flex flex-col items-center justify-center">
        <div className="flex items-center space-x-4">
          {/* Kullanıcının mevcut profil resmi */}
          <img
            src={formData.profilePicture}
            className="w-20 h-24 rounded-lg border "
            alt="Profil Fotoğrafı"
            
          />

          {/* Dosya yükleme inputu */}
          <div className="space-y-3  h-24 flex flex-col justify-between">
            <FileInput
              sizing="sm"
              id="profilePicture"
               type="file"
            accept="image/*" 
            className=""
              onChange={(e) => setFile(e.target.files[0])}
              />
              <Button 
              className="w-full"
              size="sm"
              onClick={handleImageUpload}
              gradientDuoTone="purpleToBlue">Upload Image</Button>
              
          </div>
        </div>
        <TextInput
          id="username"
          className="w-full"
          type="text"
          placeholder="username"
          value={formData.username} 
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }/>
        <TextInput
        id="email"
          className="w-full"
          type="email"
          placeholder="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          } />
        <TextInput
          id="password"
          className="w-full"
          type="password"
          placeholder="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }/>

        <Button
        type="submit"
        gradientDuoTone="purpleToBlue" className="w-full  ">Update User </Button>
        <p className="flex items-center justify-center space-x-3">isadmin: {currentUser.isAdmin ? (
                            <FaCheck className='text-green-500 ' />
                          ) : (
                            <FaTimes className='text-red-500' />
                          )}
        </p>
        <p>id: {currentUser?._id}</p>
      </form>
      </div>
     
      <div className="flex-1   border-gray-500">
      
  <div className='px-3 md:mx-auto '>
      <div className={`grid grid-cols-1  lg:grid-cols-2 ${currentUser.isOwner && 'xl:grid-cols-3'}   gap-4 justify-items-center`}>

      {currentUser.isOwner ?
      
      <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 dark:border border-gray-400  w-full rounded-md shadow-md shadow-gray-400 dark:shadow-none'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>Total Users</h3>
              <p className='text-2xl'>{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className='bg-teal-600  text-white rounded-full text-5xl p-3 shadow-md shadow-gray-400 dark:shadow-none' />
          </div>
          <div className='flex  gap-2 text-sm'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div> : ''}

        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 dark:border border-gray-400 w-full rounded-md shadow-md shadow-gray-400 dark:shadow-none'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>
                Total Category
              </h3>
              <p className='text-2xl'>{totalCategory}</p>
            </div>
            <HiAnnotation className='bg-indigo-600  text-white rounded-full text-5xl p-3 shadow-md shadow-gray-400 dark:shadow-none' />
          </div>
          <div className='flex  gap-2 text-sm'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthCategory}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>

        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 dark:border border-gray-400 w-full rounded-md shadow-md shadow-gray-400 dark:shadow-none'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>Total Products</h3>
              <p className='text-2xl'>{totalProducts}</p>
            </div>
            <HiDocumentText className='bg-lime-600  text-white rounded-full text-5xl p-3 shadow-md shadow-gray-400 dark:shadow-none' />
          </div>
          <div className='flex  gap-2 text-sm'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthProducts}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>

      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 ${currentUser?.isOwner &&'xl:grid-cols-3'} gap-4 py-3  justify-center`}>

        
     {currentUser?.isOwner &&
       <div className='flex flex-col w-full dark:border border-gray-400 md:w-auto shadow-md shadow-gray-400 dark:shadow-none p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between  p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Recent users</h1>
            <Button outline gradientDuoTone='purpleToPink'>
              <Link to={'/panel?tab=users'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            {users &&
              users.map((user) => (
                <Table.Body key={user._id} className='divide-y  '>
                  <Table.Row className='bg-white border dark:border-gray-700 dark:bg-gray-900'>
                    <Table.Cell>
                      <img
                        src={user.profilePicture}
                        alt='user'
                        className='w-10 h-10 rounded-full bg-gray-500'
                      />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        }

        <div className='flex flex-col w-full dark:border border-gray-400 md:w-auto shadow-md shadow-gray-400 dark:shadow-none p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between  p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Recent category</h1>
            <Button outline gradientDuoTone='purpleToPink'>
              <Link to={'/panel?tab=category'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>category title</Table.HeadCell>
              <Table.HeadCell>Images</Table.HeadCell>
            </Table.Head>
            {category &&
              category.map((category) => (
                <Table.Body key={category._id} className='divide-y'>
                  <Table.Row className='bg-white border dark:border-gray-700  dark:bg-gray-900'>
                    <Table.Cell className='w-96'>
                        <p className='line-clamp-2'>{category.title}</p>
                    </Table.Cell>
                    <Table.Cell>
                      <img
                        src={category.image}
                        alt='user'
                        className='w-14 h-10 rounded-md bg-gray-500'
                      />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>

        <div className='flex flex-col w-full dark:border border-gray-400 md:w-auto shadow-md shadow-gray-400 dark:shadow-none p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between  p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Recent products</h1>
            <Button outline gradientDuoTone='purpleToPink'>
              <Link to={'/panel?tab=products'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Product image</Table.HeadCell>
              <Table.HeadCell>Product Title</Table.HeadCell>
            </Table.Head>
            {products &&
              products.map((product) => (
                 <Table.Body key={product._id} className='divide-y'>
                  <Table.Row className='bg-white border dark:border-gray-700 dark:bg-gray-900'>
                    <Table.Cell className='w-96'>
                        <p className='line-clamp-2'>{product.title}</p>
                    </Table.Cell>
                    <Table.Cell>
                      <img
                        src={product.image}
                        alt='user'
                        className='w-14 h-10 rounded-md bg-gray-500'
                      />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        
      </div>
    </div>

      </div>


    </div>
  );
}

export default Profile;
