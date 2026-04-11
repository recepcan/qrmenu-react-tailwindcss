import { Button, FileInput, TextInput, Table } from "flowbite-react";
import { useEffect, useState, memo } from "react";
import { useSelector } from "react-redux";
import { HiArrowNarrowUp, HiOutlineUserGroup } from "react-icons/hi";
import { BiSolidCategory } from "react-icons/bi";
import { IoFastFood } from "react-icons/io5";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaCheck, FaTimes } from "react-icons/fa";
import {
  btnSecondary,
  card,
  cardPad,
  formCard,
  pageTitle,
  statCard,
  tableScroll,
  tableShell,
} from "./adminUi";

function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [users, setUsers] = useState([]);
  const [category, setCategory] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategory, setTotalCategory] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthProducts, setLastMonthProducts] = useState(0);
  const [lastMonthCategory, setLastMonthCategory] = useState(0);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/server/user/${currentUser._id}`);
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.message);
          return;
        }
        setFormData(data);
      } catch (error) {
        toast.error(error.message);
      }
    };
    if (currentUser?._id) fetchUser();
  }, [currentUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/server/user/getusers?limit=5");
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    const fetchProducts = async () => {
      try {
        let res = null;
        if (currentUser.isOwner) {
          res = await fetch("/server/product/getproducts?limit=5");
        } else {
          res = await fetch(
            `/server/product/getproducts?userId=${currentUser._id}`
          );
        }
        const data = await res.json();
        if (res.ok) {
          setProducts(data.products);
          setTotalProducts(data.totalProducts);
          setLastMonthProducts(data.lastMonthProducts);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    const fetchCategory = async () => {
      try {
        let res = null;
        if (currentUser.isOwner) {
          res = await fetch("/server/category/getcategory?limit=5");
        } else {
          res = await fetch(
            `/server/category/getcategory?userId=${currentUser._id}`
          );
        }
        const data = await res.json();
        if (res.ok) {
          setCategory(data.category);
          setTotalCategory(data.totalCategory);
          setLastMonthCategory(data.lastMonthCategory);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (currentUser?.isAdmin) {
      fetchUsers();
      fetchProducts();
      fetchCategory();
    }
  }, [currentUser]);

  const handleImageUpload = async () => {
    if (!file) {
      toast.error("Lütfen bir dosya seçin.");
      return;
    }
    try {
      const imageData = new FormData();
      imageData.append("file", file);
      imageData.append("upload_preset", "userImage");
      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: imageData }
      );
      const cloudinaryData = await cloudinaryRes.json();
      if (!cloudinaryRes.ok) {
        toast.error("Görsel yüklenemedi.");
        return;
      }
      toast.success("Görsel yüklendi.");
      setFormData({ ...formData, profilePicture: cloudinaryData.secure_url });
    } catch {
      toast.error("Yükleme sırasında hata oluştu.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/server/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }
      toast.success("Profil güncellendi.");
    } catch (error) {
      toast.error(error?.message ?? "Güncelleme başarısız.");
    }
  };

  const statIconWrap =
    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm";

  return (
    <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start">
      <div className="w-full lg:sticky lg:top-28 lg:max-w-sm lg:shrink-0">
        <form
          onSubmit={handleSubmit}
          className={`${formCard} flex flex-col gap-5`}
        >
          <h2 className={pageTitle}>Profil</h2>
          <div className="flex items-start gap-4">
            {formData.profilePicture ? (
              <img
                src={formData.profilePicture}
                className="h-24 w-20 rounded-xl border border-stone-200 object-cover dark:border-gray-600"
                alt="Profil"
              />
            ) : (
              <div
                className="h-24 w-20 rounded-xl border border-dashed border-stone-300 bg-stone-100 dark:border-gray-600 dark:bg-gray-700"
                aria-hidden
              />
            )}
            <div className="flex min-h-[6rem] flex-1 flex-col justify-between gap-3">
              <FileInput
                sizing="sm"
                id="profilePicture"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <Button
                size="sm"
                type="button"
                onClick={handleImageUpload}
                className="w-full bg-emerald-600 enabled:hover:bg-emerald-700"
              >
                Görseli yükle
              </Button>
            </div>
          </div>
          <TextInput
            id="username"
            type="text"
            placeholder="Kullanıcı adı"
            value={formData.username ?? ""}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
          <TextInput
            id="email"
            type="email"
            placeholder="E-posta"
            value={formData.email ?? ""}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <TextInput
            id="password"
            type="password"
            placeholder="Yeni şifre (opsiyonel)"
            value={formData.password ?? ""}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <Button
            type="submit"
            className="w-full bg-emerald-600 enabled:hover:bg-emerald-700"
          >
            Kaydet
          </Button>
          <div className="flex flex-wrap items-center gap-2 border-t border-stone-100 pt-4 text-sm dark:border-gray-700">
            <span className="text-stone-500 dark:text-gray-400">Admin:</span>
            {currentUser.isAdmin ? (
              <FaCheck className="text-emerald-600" />
            ) : (
              <FaTimes className="text-red-500" />
            )}
          </div>
        </form>
      </div>

      <div className="min-w-0 flex-1 space-y-8">
        {currentUser.isAdmin && (
          <>
            <div
              className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${currentUser.isOwner ? "xl:grid-cols-3" : ""}`}
            >
              {currentUser.isOwner && (
                <div className={statCard}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-gray-400">
                        Toplam kullanıcı
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-stone-900 dark:text-white">
                        {totalUsers}
                      </p>
                    </div>
                    <div className={statIconWrap}>
                      <HiOutlineUserGroup className="text-2xl" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-sm text-stone-500 dark:text-gray-400">
                    <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                      <HiArrowNarrowUp className="mr-0.5" />
                      {lastMonthUsers}
                    </span>
                    <span>son ay</span>
                  </div>
                </div>
              )}

              <div className={statCard}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-gray-400">
                      Toplam kategori
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-stone-900 dark:text-white">
                      {totalCategory}
                    </p>
                  </div>
                  <div className={statIconWrap}>
                    <BiSolidCategory className="text-2xl" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-stone-500 dark:text-gray-400">
                  <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                    <HiArrowNarrowUp className="mr-0.5" />
                    {lastMonthCategory}
                  </span>
                  <span>son ay</span>
                </div>
              </div>

              <div className={statCard}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-gray-400">
                      Toplam ürün
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-stone-900 dark:text-white">
                      {totalProducts}
                    </p>
                  </div>
                  <div className={statIconWrap}>
                    <IoFastFood className="text-2xl" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-stone-500 dark:text-gray-400">
                  <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                    <HiArrowNarrowUp className="mr-0.5" />
                    {lastMonthProducts}
                  </span>
                  <span>son ay</span>
                </div>
              </div>
            </div>

            <div
              className={`grid grid-cols-1 gap-4 lg:grid-cols-2 ${currentUser?.isOwner ? "xl:grid-cols-3" : ""}`}
            >
              {currentUser?.isOwner && (
                <div className={`${card} overflow-hidden p-0`}>
                  <div className={`${cardPad} flex items-center justify-between border-b border-stone-100 dark:border-gray-700`}>
                    <h3 className="font-semibold text-stone-900 dark:text-white">
                      Son kullanıcılar
                    </h3>
                    <Link to="/panel?tab=users" className={btnSecondary}>
                      Tümü
                    </Link>
                  </div>
                  <div className={tableScroll}>
                    <div className={tableShell}>
                      <Table hoverable>
                        <Table.Head>
                          <Table.HeadCell>Avatar</Table.HeadCell>
                          <Table.HeadCell>Kullanıcı</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y dark:divide-gray-700">
                          {users.map((user) => (
                            <Table.Row
                              key={user._id}
                              className="bg-white dark:bg-gray-800/80"
                            >
                              <Table.Cell>
                                <img
                                  src={user.profilePicture}
                                  alt=""
                                  className="h-10 w-10 rounded-full object-cover bg-stone-200"
                                />
                              </Table.Cell>
                              <Table.Cell className="font-medium">
                                {user.username}
                              </Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table>
                    </div>
                  </div>
                </div>
              )}

              <div className={`${card} overflow-hidden p-0`}>
                <div className={`${cardPad} flex items-center justify-between border-b border-stone-100 dark:border-gray-700`}>
                  <h3 className="font-semibold text-stone-900 dark:text-white">
                    Son kategoriler
                  </h3>
                  <Link to="/panel?tab=category" className={btnSecondary}>
                    Tümü
                  </Link>
                </div>
                <div className={tableScroll}>
                  <div className={tableShell}>
                    <Table hoverable>
                      <Table.Head>
                        <Table.HeadCell>Başlık</Table.HeadCell>
                        <Table.HeadCell>Görsel</Table.HeadCell>
                      </Table.Head>
                      <Table.Body className="divide-y dark:divide-gray-700">
                        {category.map((c) => (
                          <Table.Row
                            key={c._id}
                            className="bg-white dark:bg-gray-800/80"
                          >
                            <Table.Cell className="max-w-[10rem]">
                              <span className="line-clamp-2">{c.title}</span>
                            </Table.Cell>
                            <Table.Cell>
                              <img
                                src={c.image}
                                alt=""
                                className="h-10 w-16 rounded-lg object-cover bg-stone-200"
                              />
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                  </div>
                </div>
              </div>

              <div className={`${card} overflow-hidden p-0 lg:col-span-2 xl:col-span-1`}>
                <div className={`${cardPad} flex items-center justify-between border-b border-stone-100 dark:border-gray-700`}>
                  <h3 className="font-semibold text-stone-900 dark:text-white">
                    Son ürünler
                  </h3>
                  <Link to="/panel?tab=products" className={btnSecondary}>
                    Tümü
                  </Link>
                </div>
                <div className={tableScroll}>
                  <div className={tableShell}>
                    <Table hoverable>
                      <Table.Head>
                        <Table.HeadCell>Başlık</Table.HeadCell>
                        <Table.HeadCell>Görsel</Table.HeadCell>
                      </Table.Head>
                      <Table.Body className="divide-y dark:divide-gray-700">
                        {products.map((product) => (
                          <Table.Row
                            key={product._id}
                            className="bg-white dark:bg-gray-800/80"
                          >
                            <Table.Cell className="max-w-[10rem]">
                              <span className="line-clamp-2">
                                {product.title}
                              </span>
                            </Table.Cell>
                            <Table.Cell>
                              <img
                                src={product.image}
                                alt=""
                                className="h-10 w-16 rounded-lg object-cover bg-stone-200"
                              />
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default memo(Profile);
