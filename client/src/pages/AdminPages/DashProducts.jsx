import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { toast } from 'react-toastify';

export default function DashProducts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userProducts, setUserProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState([]);

  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState('');
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let res =null
        if(currentUser.isOwner )  
           { 
            res = await fetch('/server/product/getproducts');       
           }
          else {
            res = await fetch(`/server/product/getproducts?userId=${currentUser._id}`);
          } 
       
        const data = await res.json();
        if (res.ok) {
          setUserProducts(data.products);
          setTotalProducts(data.totalProducts)
          if (data.products.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchProducts();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userProducts.length;
    try {
      
      let res =null
        if(currentUser.isOwner )  
           { 
            res = await fetch(`/server/product/getproducts?startIndex=${startIndex}`);
          }
          else {
            res = await fetch(`/server/product/getproducts?userId=${currentUser._id}&startIndex=${startIndex}`);
          } 
       
      const data = await res.json();
      if (res.ok) {
        setUserProducts((prev) => [...prev, ...data.products]);
        if (data.products.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteProduct = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/server/product/deleteproduct/${productIdToDelete}/${currentUser._id}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserProducts((prev) =>
          prev.filter((product) => product._id !== productIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='  cursor-all-scroll md:mx-auto p-3 
     flex flex-col items-center justify-center space-y-5
     scrollbar-thin  scrollbar-track-slate-100 scrollbar-thumb-slate-300
      dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500
   '>
   <div>
   total products: {totalProducts}
    </div>
    
    {currentUser.isAdmin && userProducts.length > 0 ? (
        <div className='w-full overflow-x-auto shadow-md dark:shadow-none shadow-gray-400 rounded-lg'>
          <Table hoverable className='shadow-md '>
            <Table.Head>
              <Table.HeadCell>user</Table.HeadCell>
              <Table.HeadCell>price</Table.HeadCell>
              <Table.HeadCell>stock</Table.HeadCell>
              <Table.HeadCell>image</Table.HeadCell>
              <Table.HeadCell>title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userProducts.map((product,index) => (
              <Table.Body className=' ' key={index}>
                <Table.Row className={`bg-white dark:border-gray-700 dark:bg-gray-800 ${product.stock=='0' && 'border border-red-600 dark:border-red-900'}`}>
                <Table.Cell>
                {/*new Date(product.updatedAt).toLocaleDateString() */}
                {product.username} 
              </Table.Cell>

                <Table.Cell>
                    {/*new Date(product.updatedAt).toLocaleDateString() */}
                    {product.price} tl
                  </Table.Cell>
                  <Table.Cell className={` ${product.stock<='10' && 'text-orange-300'}  ${product.stock=='0' && 'text-red-600'} }`}>
                    
                    {product.stock}
                  </Table.Cell>
                  <Table.Cell>
                  
                      <img
                        src={product.image}
                        alt={product.title}
                        className='w-20 h-10 object-cover bg-gray-500'
                      />
                    
                  </Table.Cell>
                  <Table.Cell>
                    
                      {product.title}
                    
                  </Table.Cell>
                  <Table.Cell>{product.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setProductIdToDelete(product._id);
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className='text-teal-500 hover:underline'
                      to={`/update-product/${product._id}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <Button 
            gradientDuoTone='greenToBlue'
              onClick={handleShowMore}
              className='w-full self-center text-sm py-2'
            >
              Show more
            </Button>
          )}
        </div>
      ) : (
        <p>You have no products yet!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this product?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteProduct}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}