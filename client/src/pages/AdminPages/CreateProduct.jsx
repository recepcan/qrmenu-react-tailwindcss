import { Alert, Button, FileInput, Select, Label,TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import {toast} from 'react-toastify'
import 'react-quill/dist/quill.snow.css';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../../firebase';
import { useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';

export default function CreateProduct() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  const navigate = useNavigate();


  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price || !formData.stock || !formData.category || !file) {
      setPublishError('Please fill in all required fields.');
      return;
    }
  
    const productData = new FormData();
    productData.append('title', formData.title);
    productData.append('price', formData.price);
    productData.append('stock', formData.stock);
    productData.append('category', formData.category);
    productData.append('content', formData.content);
    productData.append('image', file);
  
    try {
      const res = await fetch('/server/product/create', {
        method: 'POST',
        body: productData,
      });
  
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }
  
      setPublishError(null);
      navigate(`/panel?tab=products`);
    } catch (error) {
      toast.error('Something went wrong',error);
    }
  };
  return (
    <div className='p-3 w-full flex flex-col min-h-screen border-2 bg-black/70'>
      <h1 className='text-center text-3xl my-7 font-semibold text-white'>Create a product</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between flex-wrap '>
          <TextInput
          color="gray"
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <TextInput
          color="gray"
            type='text'
            placeholder='price'
            required
            id='price'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />
          <TextInput
          color="gray"
            type='text'
            placeholder='stock'
            required
            id='stock'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
          />
          <TextInput
          color="gray"
          type='text'
          placeholder='category'
          required
          id='category'
          className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            />
          
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <input
            type='file'
            accept='image/*'
            className='text-white'
            onChange={(e) => setFile(e.target.files[0])}
          />
          
        </div>
        <ReactQuill
          theme='snow'
          placeholder='Write something...'
          className='h-72 mb-16  text-white'
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type='submit' gradientMonochrome="success">
          Publish
        </Button>
        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}