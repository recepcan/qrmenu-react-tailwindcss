import { Alert, Button, FileInput, Select, Label,TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import {toast} from 'react-toastify'
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function CreateProduct() {
  const [file, setFile] = useState(null);
 const {currentUser}=useSelector(state=>state.user)
  const [formData, setFormData] = useState({});
  const [userCategory, setUserCategory] = useState([]);

console.log(formData,"formdata")
  const navigate = useNavigate();


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


  const handleImageUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload.');
      return;
    }

    try {
      const imageData = new FormData();
      imageData.append('file', file);
      imageData.append('upload_preset', 'products'); // Cloudinary için preset

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
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.price ) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      const productData = {
        title: formData.title,
        price: formData.price,
        stock:formData.stock,
        content:formData.content,
        image: formData.image,
        category: formData.category,
      };

      const res = await fetch(`server/product/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success('Category created successfully!');
      navigate(`/panel?tab=products`);
    } catch (error) {
      toast.error('Something went wrong during category creation.');
      console.log(error);
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
      
        <Select id="category" 
        required  
        onChange={(e) =>
          setFormData({ ...formData, category: e.target.value })
        }>
            { userCategory?.map((ctg,i)=>(
              <option key={i} className='text-white'>{ctg.name} </option>
            ))

            }
      </Select>

       
        
      </div>
      <div className='flex w-full gap-4 items-center rounded-xl justify-between border-4 border-teal-500 border-dotted p-3'>
        <FileInput
        
          type='file'
          accept='image/*'
          className='text-white w-full'
          onChange={(e) => setFile(e.target.files[0])}
        />
        <Button
          gradientMonochrome='info'
          onClick={handleImageUpload}
        >
          Upload Image
        </Button>
        
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