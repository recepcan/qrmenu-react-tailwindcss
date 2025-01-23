import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function UpdateCategory() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const { categoryId } = useParams();

  const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    try {
      const fetchCategory = async () => {
        const res = await fetch(`/server/category/getcategory?categoryId=${categoryId}`);
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.message);
          return;
        }
        if (res.ok) {
          setFormData(data.category[0]);
        }
      };

      fetchCategory();
    } catch (error) {
      toast.error(error.message);
    }
  }, [categoryId]);

 
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // FormData nesnesi oluştur
    const categoryData = new FormData();
    categoryData.append('title', formData.title);
    categoryData.append('name', formData.name);
  
    // Yeni resim seçilmişse ekle, seçilmemişse eski resmi koru
    if (file) {
      categoryData.append('image', file);
    } else {
      categoryData.append('image', formData.image); 
    }
  
    try {
      const res = await fetch(`/server/category/updatecategory/${formData._id}/${currentUser._id}`, {
        method: 'PUT',
        body: categoryData, // JSON yerine FormData gönder
      });
  
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }
  
      navigate(`/panel?tab=category`);
    } catch (error) {
      toast.error('Something went wrong', error);
    }
  };
  
  return (
    <div className='p-3 w-full bg-black/70  min-h-screen '>
      <h1 className='text-center text-3xl my-7 font-semibold text-white'>Update category</h1>
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
            placeholder='name'
            required
            id='name'
            className='flex-1 text-black rounded-lg'
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            value={formData.name}
          />
          </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e) => setFile(e.target.files[0])}
          />
      </div>
           
        {formData.image && (
          <img
            src={`http://localhost:5000${formData.image}`}
            alt='upload'
            className='w-full h-72 object-contain'
          />
        )}
        
        <Button type='submit' gradientMonochrome="cyan">
          Update post
        </Button>
        
      </form>
    </div>
  );
}