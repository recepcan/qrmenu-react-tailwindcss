import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Table, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  btnPrimary,
  btnSecondary,
  card,
  cardPad,
  dangerLink,
  emptyState,
  pageDesc,
  pageHeader,
  pageTitle,
  tableScroll,
  tableShell,
} from "./adminUi";

function Users() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/server/user/getusers");
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          if (data.users.length < 9) setShowMore(false);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchUsers();
  }, []);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/server/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) setShowMore(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/server/user/delete/${userIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setShowModal(false);
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleToggleAdmin = async (userId, currentStatus) => {
    try {
      const res = await fetch(`/server/user/update/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAdmin: !currentStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("İşlem başarılı");
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isAdmin: !user.isAdmin } : user
          )
        );
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className={pageHeader}>
        <div>
          <h1 className={pageTitle}>Kullanıcılar</h1>
          <p className={pageDesc}>
            Toplam{" "}
            <span className="font-semibold text-stone-700 dark:text-stone-300">
              {totalUsers}
            </span>{" "}
            kullanıcı
          </p>
        </div>
      </div>

      {currentUser?.isAdmin && users.length > 0 ? (
        <div className={`${card} overflow-hidden p-0`}>
          <div className={tableScroll}>
            <div className={tableShell}>
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Sahip</Table.HeadCell>
                  <Table.HeadCell>Avatar</Table.HeadCell>
                  <Table.HeadCell>Kullanıcı adı</Table.HeadCell>
                  <Table.HeadCell>E-posta</Table.HeadCell>
                  <Table.HeadCell>Admin</Table.HeadCell>
                  <Table.HeadCell>Sil</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y dark:divide-gray-700">
                  {users.map((user) => (
                    <Table.Row
                      key={user._id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800/80"
                    >
                      <Table.Cell>
                        {user.isOwner ? (
                          <FaCheck className="text-emerald-600" aria-label="Evet" />
                        ) : (
                          <FaTimes className="text-stone-400" aria-label="Hayır" />
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <img
                          src={user.profilePicture}
                          alt=""
                          className="h-10 w-10 rounded-full object-cover bg-stone-200 dark:bg-gray-700"
                        />
                      </Table.Cell>
                      <Table.Cell className="font-medium">{user.username}</Table.Cell>
                      <Table.Cell className="max-w-[12rem] truncate text-sm text-stone-600 dark:text-gray-400">
                        {user.email}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                          {user.isAdmin ? (
                            <FaCheck className="text-emerald-600" />
                          ) : (
                            <FaTimes className="text-stone-400" />
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleAdmin(user._id, user.isAdmin)
                            }
                            className={
                              user.isAdmin ? `${btnSecondary} !py-1.5 !px-2 text-xs` : `${btnPrimary} !py-1.5 !px-2 text-xs`
                            }
                          >
                            {user.isAdmin ? "Admin kaldır" : "Admin yap"}
                          </button>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <button
                          type="button"
                          onClick={() => {
                            setShowModal(true);
                            setUserIdToDelete(user._id);
                          }}
                          className={dangerLink}
                        >
                          Sil
                        </button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </div>
          {showMore && (
            <div className={`${cardPad} border-t border-stone-100 dark:border-gray-700`}>
              <button type="button" className={`${btnPrimary} w-full`} onClick={handleShowMore}>
                Daha fazla yükle
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className={emptyState}>Kullanıcı listesi boş veya erişim yok.</p>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-stone-400 dark:text-gray-500" />
            <h3 className="mb-5 text-lg text-stone-600 dark:text-gray-300">
              Bu kullanıcıyı silmek istediğinize emin misiniz?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Evet, sil
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Vazgeç
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Users;
