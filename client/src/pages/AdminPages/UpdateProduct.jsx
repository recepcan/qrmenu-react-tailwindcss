import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from 'react';
import {toast} from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UpdateProduct() {
  const [file, setFile] = useState(null);
  
  
  const [formData, setFormData] = useState({});
  
  const { productId } = useParams();

  const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);
  
    const [userCategory, setUserCategory] = useState([]);

    useEffect(() => {
      const fetchCategory = async () => {
        try {
          const res = await fetch(`/server/category/getcategory?userId=${currentUser._id}`);
          const data = await res.json();
          if (res.ok) {
            setUserCategory(data.category);
          }
        } catch (error) {
          console.log(error.message);
        }
      };
      if (currentUser.isAdmin) {
          fetchCategory();
      }
    }, [currentUser._id]);

    console.log(userCategory,"userctg")
    

  useEffect(() => {
    try {
      const fetchProduct = async () => {
        const res = await fetch(`/server/product/getproducts?productId=${productId}`);
        const data = await res.json();
        if (!res.ok) {
          
          toast.error(data.message);
          return;
        }
        if (res.ok) {
          toast.error(null);
          setFormData(data.products[0]);
        }
      };

      fetchProduct();
    } catch (error) {
      toast.error(error.message);
    }
  }, [productId]);

  const handleImageUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload.');
      return null;
    }
  
    try {
      const imageData = new FormData();
      imageData.append('file', file); // Dosyayı FormData'ya ekliyoruz
      imageData.append('upload_preset', 'products'); // Cloudinary için preset değeri
  
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
      setFormData({...formData,image:cloudinaryData.secure_url}) // Yüklenen görselin URL'sini döndür
    } catch (error) {
      toast.error('Something went wrong during image upload.');
      console.error(error);
      return null;
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/server/product/updateproduct/${formData._id}/${currentUser._id}`, {
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
        navigate(`/panel?tab=products`);
      }
    } catch (error) {
      toast.error('Something went wrong',error.message);
    }
  };
  

  return (
    <div className='p-3 w-full py-24 flex items-center justify-center'>
     <div className='max-w-2xl bg-gray-300 dark:bg-gray-800 rounded-xl p-5'>
     <h1 className='text-center text-3xl my-7 font-semibold '>Update product</h1>
     <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
       <div className='grid grid-cols-1 xs:grid-cols-2 flex-col gap-4 sm:flex-row flex-wrap justify-between'>
         <TextInput
         
           type='text'
           placeholder='Title'
           required
           id='title'
           className='flex-1 rounded-lg text-black'
           onChange={(e) =>
             setFormData({ ...formData, title: e.target.value })
           }
           value={formData.title}
         />
         <TextInput
           type='text'
           placeholder='price'
           required
           id='price'
           className='flex-1 text-black rounded-lg'
           onChange={(e) =>
             setFormData({ ...formData, price: e.target.value })
           }
           value={formData.price}
         />
         <TextInput
           type='text'
           placeholder='stock'
           required
           id='stock'
           className='flex-1 text-black rounded-lg'
           onChange={(e) =>
             setFormData({ ...formData, stock: e.target.value })
           }
           value={formData.stock}
         />
         <Select id="category" 
         className='flex-1'
       required  
       value={formData.category}
       onChange={(e) =>
         setFormData({ ...formData, category: e.target.value })
       }>
           { userCategory?.map((ctg,i)=>(
             <option key={i} className='text-white'>{ctg.name} </option>
           ))

           }
     </Select>
       </div>
       <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
         <FileInput
           type='file'
           accept='image/*'
           className='w-full'
           onChange={(e) => setFile(e.target.files[0])}
         />
         <Button
         gradientMonochrome='info'
         
         onClick={handleImageUpload}
       >
         Upload Image
       </Button>
         
       </div>
      
       {formData.image && (
         <img
           src={formData.image}
           alt='upload'
           className='w-full h-72 object-contain'
         />
       )}
       <ReactQuill
         theme='snow'
         value={formData.content}
         placeholder='Write something...'
         className='h-72 mb-16'
         required
         onChange={(value) => {
           setFormData({ ...formData, content: value });
         }}
       />
       <Button type='submit' gradientMonochrome="cyan">
         Update product
       </Button>
      
     </form>
     </div>
    </div>
  );
}