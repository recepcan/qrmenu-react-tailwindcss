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
  
      const cloudinaryRes = await fetch('https://api.cloudinary.com/v1_1/dkbg1ejbx/image/upload', {
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
    <div className='p-3 w-full bg-black/70  '>
      <h1 className='text-center text-3xl my-7 font-semibold text-white'>Update product</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <input
          
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
          <input
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
          <input
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
          <input
            type='text'
            placeholder='product'
            required
            id='category'
            className='flex-1 text-black rounded-lg'
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category}
          />
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
          gradientMonochrome='info'
          className='w-full'
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
          className='h-72 mb-12'
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type='submit' gradientDuoTone='purpleToPink'>
          Update post
        </Button>
       
      </form>
    </div>
  );
}