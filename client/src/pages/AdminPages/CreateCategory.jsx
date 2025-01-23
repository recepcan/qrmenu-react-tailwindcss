import { Alert, Button, FileInput, Select, Label,TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import {toast} from 'react-toastify'

import { useState } from 'react';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';

export default function CreateCategory() {
  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  const navigate = useNavigate();


  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.name || !file) {
      setPublishError('Please fill in all required fields.');
      return;
    }
  
    const categoryData = new FormData();
    categoryData.append('title', formData.title);
    categoryData.append('name', formData.name);
    categoryData.append('image', file);
  
    try {
      const res = await fetch('/server/category/create', {
        method: 'POST',
        body: categoryData,
      });
  
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }
  
      setPublishError(null);
      navigate(`/panel?tab=category`);
    } catch (error) {
      toast.error('Something went wrong',error);
      console.log(categoryData.append)
    }
  };
  return (
    <div className='p-3 w-full flex flex-col min-h-screen border-2 bg-black/70'>
      <h1 className='text-center text-3xl my-7 font-semibold text-white'>Create a category</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between flex-wrap '>
          <TextInput
          color="gray"
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1 text-black'
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <TextInput
          color="gray"
            type='text'
            placeholder='name'
            required
            id='name'
            className='flex-1  text-black'
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
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
       
        <Button type='submit' gradientMonochrome="success">
          Publish
        </Button>
       
      </form>
    </div>
  );
}