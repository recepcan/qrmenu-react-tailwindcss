import { Alert, Button, FileInput, Select, Label,TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import {toast} from 'react-toastify'
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateProduct() {
  const [file, setFile] = useState(null);
 
  const [formData, setFormData] = useState({});
  

  const navigate = useNavigate();


  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price || !formData.stock || !formData.category || !file) {
      toast.error('Please fill in all required fields.');
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
  
     
      navigate(`/panel?tab=products`);
    } catch (error) {
      toast.error('Something went wrong',error);
    }
  };
  return (
    <div className='p-3 w-full flex flex-col items-center justify-center  min-h-screen   py-24'>
     
    
    <div className='sm:w-[640px] max-md:w-full space-y-5 p-5 rounded-xl bg-gray-300 dark:bg-gray-800   min-h-[400px]  
    flex flex-col '>
    <h1 className='text-center text-3xl  font-semibold '>Create a product</h1>
    <form className='flex flex-col items-center justify-between   gap-4 h-full space-y-5' onSubmit={handleSubmit}>
      <div className='flex flex-col gap-4 w-full sm:flex-row  justify-between flex-wrap  '>
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
      <div className='flex w-full gap-4 items-center rounded-xl justify-between border-4 border-teal-500 border-dotted p-3'>
        <FileInput
        
          type='file'
          accept='image/*'
          className='text-white w-full'
          onChange={(e) => setFile(e.target.files[0])}
        />
        
      </div>
      <div className='p-3 border w-full rounded-xl'>
      <ReactQuill
          theme='snow'
          placeholder='Write something...'
          className='h-72 mb-12 w-full  p-3 '
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
      </div>

     
      <Button 
      type='submit' 
      gradientMonochrome="success"
      className='w-full'>
        Publish
      </Button>
     
    </form>
    </div>
    </div>
  );
}