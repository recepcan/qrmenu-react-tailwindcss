import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { toast } from 'react-toastify';

export default function DashHome() {
  const { currentUser } = useSelector((state) => state.user);
  const [userHome, setUserHome] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [homeIdToDelete, setHomeIdToDelete] = useState('');
  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await fetch(`/server/home/gethome?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserHome(data.home);
          if (data.home.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
        fetchHome();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userHome.length;
    try {
      const res = await fetch(
        `/server/home/gethome?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserHome((prev) => [...prev, ...data.home]);
        if (data.home.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteHome = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/server/home/deletehome/${homeIdToDelete}/${currentUser._id}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserHome((prev) =>
          prev.filter((home) => home._id !== homeIdToDelete)
        );
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto   p-3 flex flex-col items-center justify-center space-y-5
     scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300
      dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
    <Link to={'/create-home'}>
    <Button  gradientDuoTone="tealToLime">create home</Button>
    </Link>  
    {currentUser.isAdmin && userHome?.length > 0 ? (
        <div className='w-full'>
          <Table hoverable className='shadow-md border  w-full'>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>home image</Table.HeadCell>
              <Table.HeadCell>home title</Table.HeadCell>
              <Table.HeadCell>Home name</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userHome.map((home) => (
              <Table.Body className='divide-y' key={home._id}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {new Date(home.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    
                      <img
                        src={`http://localhost:5000${home.image}`}
                        alt={home.title}
                        className='w-20 h-10 object-cover bg-gray-500'
                      />
                    
                  </Table.Cell>
                  <Table.Cell>
                    
                      {home.title}
                   
                  </Table.Cell>
                  <Table.Cell>{home.name}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setHomeIdToDelete(home._id);
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className='text-teal-500 hover:underline'
                      to={`/update-home/${home._id}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-sm py-7'
            >
              Show more
            </button>
          )}
        </div>
      ) : (
        <p>You have no homes yet!</p>
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
              Are you sure you want to delete this home?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteHome}>
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