import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { toast } from "react-toastify";
import {
  btnPrimary,
  btnSecondary,
  card,
  cardPad,
  dangerLink,
  emptyState,
  linkAccent,
  pageDesc,
  pageHeader,
  pageTitle,
  tableScroll,
  tableShell,
} from "./adminUi";

function homeImageSrc(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `http://localhost:5000${path}`;
}

export default function DashHome() {
  const { currentUser } = useSelector((state) => state.user);
  const [userHome, setUserHome] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [homeIdToDelete, setHomeIdToDelete] = useState("");

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await fetch(
          `/server/home/gethome?userId=${currentUser._id}`
        );
        const data = await res.json();
        if (res.ok) {
          setUserHome(data.home);
          if (data.home.length < 9) setShowMore(false);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    if (currentUser?.isAdmin) fetchHome();
  }, [currentUser?._id, currentUser?.isAdmin]);

  const handleShowMore = async () => {
    const startIndex = userHome.length;
    try {
      const res = await fetch(
        `/server/home/gethome?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserHome((prev) => [...prev, ...data.home]);
        if (data.home.length < 9) setShowMore(false);
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
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok) toast.error(data.message);
      else
        setUserHome((prev) => prev.filter((home) => home._id !== homeIdToDelete));
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className={pageHeader}>
        <div>
          <h1 className={pageTitle}>Anasayfa içerikleri</h1>
          <p className={pageDesc}>Arka plan / vitrin görsellerinizi yönetin</p>
        </div>
        <Link to="/create-home" className={btnSecondary}>
          Yeni kayıt
        </Link>
      </div>

      {currentUser?.isAdmin && userHome?.length > 0 ? (
        <div className={`${card} overflow-hidden p-0`}>
          <div className={tableScroll}>
            <div className={tableShell}>
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Güncellenme</Table.HeadCell>
                  <Table.HeadCell>Görsel</Table.HeadCell>
                  <Table.HeadCell>Başlık</Table.HeadCell>
                  <Table.HeadCell>Ad</Table.HeadCell>
                  <Table.HeadCell>Sil</Table.HeadCell>
                  <Table.HeadCell>Düzenle</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y dark:divide-gray-700">
                  {userHome.map((home) => (
                    <Table.Row
                      key={home._id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800/80"
                    >
                      <Table.Cell className="whitespace-nowrap text-sm">
                        {new Date(home.updatedAt).toLocaleDateString("tr-TR")}
                      </Table.Cell>
                      <Table.Cell>
                        <img
                          src={homeImageSrc(home.image)}
                          alt=""
                          className="h-10 w-20 rounded-lg object-cover bg-stone-200 dark:bg-gray-700"
                        />
                      </Table.Cell>
                      <Table.Cell className="max-w-xs">
                        <span className="line-clamp-2">{home.title}</span>
                      </Table.Cell>
                      <Table.Cell>{home.name}</Table.Cell>
                      <Table.Cell>
                        <button
                          type="button"
                          onClick={() => {
                            setShowModal(true);
                            setHomeIdToDelete(home._id);
                          }}
                          className={dangerLink}
                        >
                          Sil
                        </button>
                      </Table.Cell>
                      <Table.Cell>
                        <Link
                          className={linkAccent}
                          to={`/update-home/${home._id}`}
                        >
                          Düzenle
                        </Link>
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
        <p className={emptyState}>
          {currentUser?.isAdmin
            ? "Henüz anasayfa kaydı yok."
            : "Bu alanı görüntüleme yetkiniz yok."}
        </p>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-stone-400 dark:text-gray-500" />
            <h3 className="mb-5 text-lg text-stone-600 dark:text-gray-300">
              Bu kaydı silmek istediğinize emin misiniz?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteHome}>
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
