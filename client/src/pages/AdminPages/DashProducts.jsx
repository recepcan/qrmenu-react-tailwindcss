import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { toast } from "react-toastify";
import {
  btnPrimary,
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

export default function DashProducts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userProducts, setUserProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let res = null;
        if (currentUser.isOwner) {
          res = await fetch("/server/product/getproducts");
        } else {
          res = await fetch(
            `/server/product/getproducts?userId=${currentUser._id}`
          );
        }
        const data = await res.json();
        if (res.ok) {
          setUserProducts(data.products);
          setTotalProducts(data.totalProducts);
          if (data.products.length < 9) setShowMore(false);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    if (currentUser?.isAdmin) fetchProducts();
  }, [currentUser?._id, currentUser?.isAdmin, currentUser?.isOwner]);

  const handleShowMore = async () => {
    const startIndex = userProducts.length;
    try {
      let res = null;
      if (currentUser.isOwner) {
        res = await fetch(`/server/product/getproducts?startIndex=${startIndex}`);
      } else {
        res = await fetch(
          `/server/product/getproducts?userId=${currentUser._id}&startIndex=${startIndex}`
        );
      }
      const data = await res.json();
      if (res.ok) {
        setUserProducts((prev) => [...prev, ...data.products]);
        if (data.products.length < 9) setShowMore(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteProduct = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/server/product/deleteproduct/${productIdToDelete}/${currentUser._id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok) toast.error(data.message);
      else
        setUserProducts((prev) =>
          prev.filter((product) => product._id !== productIdToDelete)
        );
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className={pageHeader}>
        <div>
          <h1 className={pageTitle}>Ürünler</h1>
          <p className={pageDesc}>
            Toplam <span className="font-semibold text-stone-700 dark:text-stone-300">{totalProducts}</span>{" "}
            ürün
          </p>
        </div>
      </div>

      {currentUser?.isAdmin && userProducts.length > 0 ? (
        <div className={`${card} overflow-hidden p-0`}>
          <div className={tableScroll}>
            <div className={tableShell}>
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Kullanıcı</Table.HeadCell>
                  <Table.HeadCell>Fiyat</Table.HeadCell>
                  <Table.HeadCell>Stok</Table.HeadCell>
                  <Table.HeadCell>Görsel</Table.HeadCell>
                  <Table.HeadCell>Başlık</Table.HeadCell>
                  <Table.HeadCell>Kategori</Table.HeadCell>
                  <Table.HeadCell>Sil</Table.HeadCell>
                  <Table.HeadCell>Düzenle</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y dark:divide-gray-700">
                  {userProducts.map((product) => (
                    <Table.Row
                      key={product._id}
                      className={`bg-white dark:border-gray-700 dark:bg-gray-800/80 ${
                        String(product.stock) === "0"
                          ? "border-l-4 border-l-red-500"
                          : ""
                      }`}
                    >
                      <Table.Cell className="whitespace-nowrap">
                        {product.username}
                      </Table.Cell>
                      <Table.Cell>{product.price} ₺</Table.Cell>
                      <Table.Cell
                        className={
                          String(product.stock) === "0"
                            ? "font-medium text-red-600 dark:text-red-400"
                            : Number(product.stock) <= 10
                              ? "text-amber-600 dark:text-amber-400"
                              : ""
                        }
                      >
                        {product.stock}
                      </Table.Cell>
                      <Table.Cell>
                        <img
                          src={product.image}
                          alt=""
                          className="h-10 w-20 rounded-lg object-cover bg-stone-200 dark:bg-gray-700"
                        />
                      </Table.Cell>
                      <Table.Cell className="max-w-xs">
                        <span className="line-clamp-2">{product.title}</span>
                      </Table.Cell>
                      <Table.Cell>{product.category}</Table.Cell>
                      <Table.Cell>
                        <button
                          type="button"
                          onClick={() => {
                            setShowModal(true);
                            setProductIdToDelete(product._id);
                          }}
                          className={dangerLink}
                        >
                          Sil
                        </button>
                      </Table.Cell>
                      <Table.Cell>
                        <Link
                          className={linkAccent}
                          to={`/update-product/${product._id}`}
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
            ? "Henüz ürün eklenmemiş."
            : "Bu alanı görüntüleme yetkiniz yok."}
        </p>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-stone-400 dark:text-gray-500" />
            <h3 className="mb-5 text-lg text-stone-600 dark:text-gray-300">
              Bu ürünü silmek istediğinize emin misiniz?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteProduct}>
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
