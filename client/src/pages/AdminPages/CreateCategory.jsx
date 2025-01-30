import { Alert, Button, FileInput, TextInput } from 'flowbite-react';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateCategory() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({ title: '', name: '', image: '' });
  const navigate = useNavigate();

  console.log(formData,"formdata")
  // Görsel yükleme fonksiyonu
  const handleImageUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload.');
      return;
    }

    try {
      const imageData = new FormData();
      imageData.append('file', file);
      imageData.append('upload_preset', 'categories'); // Cloudinary için preset

      const cloudinaryRes = await fetch('https://api.cloudinary.com/v1_1/dkbg1ejbx/image/upload', {
        method: 'POST',
        body: imageData,
      });

      const cloudinaryData = await cloudinaryRes.json();
      if (!cloudinaryRes.ok) {
        toast.error('Image upload failed.');
        return;
      }

      // Görsel bağlantısını form verisine kaydet
      setFormData({ ...formData, image: cloudinaryData.secure_url });
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Something went wrong during image upload.');
      console.log(error);
    }
  };

  // Kategori oluşturma fonksiyonu
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.name || !formData.image) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      const categoryData = {
        title: formData.title,
        name: formData.name,
        image: formData.image,
      };

      const res = await fetch(`server/category/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success('Category created successfully!');
      navigate(`/panel?tab=category`);
    } catch (error) {
      toast.error('Something went wrong during category creation.');
      console.log(error);
    }
  };

  return (
    <div className='p-3 w-full flex flex-col items-center justify-center min-h-screen py-20'>
      <div className='sm:w-[640px] max-md:w-full p-5 rounded-xl bg-gray-300 dark:bg-gray-800 space-y-8 min-h-[350px] flex flex-col'>
        <h1 className='text-center text-3xl font-semibold'>Create a category</h1>

        <div className='grid grid-cols-1 xs:grid-cols-2  gap-4 w-full '>
          <TextInput
            type='text'
            placeholder='Title'
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            
          />
          <TextInput
            type='text'
            placeholder='Name'
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            
          />
        </div>

        <div className='flex w-full gap-4 items-center rounded-xl justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            required
            type='file'
            accept='image/*'
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
          gradientMonochrome='info'
          
          onClick={handleImageUpload}
        >
          Upload Image
        </Button>
        </div>

        {/* Görsel yükleme butonu */}
       

        {/* Kategori oluşturma butonu */}
        <Button type='submit' gradientMonochrome='success' className='w-full' onClick={handleSubmit}>
          Publish
        </Button>

        
      </div>
    </div>
  );
}
