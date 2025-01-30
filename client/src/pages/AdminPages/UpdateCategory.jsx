import { Button, FileInput, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function UpdateCategory() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const { categoryId } = useParams();
console.log(formData,"formdata")

  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`/server/category/getcategory?categoryId=${categoryId}`);
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.message);
          return;
        }
        if (res.ok) {
          setFormData(data.category[0]);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleImageUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload.');
      return null;
    }
  
    try {
      const imageData = new FormData();
      imageData.append('file', file); // Dosyayı FormData'ya ekliyoruz
      imageData.append('upload_preset', 'categories'); // Cloudinary için preset değeri
  
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
      const res = await fetch(`/server/category/updatecategory/${formData._id}/${currentUser._id}`, {
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
        navigate(`/panel?tab=category`);
      }
    } catch (error) {
      toast.error('Something went wrong',error.message);
    }
  };

  
  



  return (
    <div className="p-3 w-full  min-h-screen py-24 flex items-center justify-center">
      <div className='border bg-gray-300 dark:bg-gray-800 p-10 rounded-xl max-w-2xl'>
      <h1 className="text-center text-3xl my-7 font-semibold  ">Update Category</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1 rounded-lg text-black"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />
          <TextInput
            type="text"
            placeholder="Name"
            required
            id="name"
            className="flex-1 text-black rounded-lg"
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            value={formData.name}
          />
        </div>

        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
          gradientMonochrome='info'
          
          onClick={handleImageUpload}
        >
          Upload Image
        </Button>
        </div>

        {formData.image && !file && (
          <img
            src={formData.image}
            alt="Current category"
            className="w-full h-72 object-contain"
          />
        )}

        <Button type="submit" gradientMonochrome="cyan">
          Update Category
        </Button>
      </form>
      </div>
    </div>
  );
}
