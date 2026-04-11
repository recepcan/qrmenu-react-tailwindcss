import { Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import { toast } from "react-toastify";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  btnPrimary,
  formCard,
  formTitle,
  inputRow,
  shell,
  uploadZone,
} from "./adminUi";

export default function CreateProduct() {
  const [file, setFile] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [userCategory, setUserCategory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(
          `/server/category/getcategory?userId=${currentUser._id}`
        );
        const data = await res.json();
        if (res.ok) setUserCategory(data.category);
      } catch (error) {
        toast.error(error.message);
      }
    };
    if (currentUser?.isAdmin) fetchCategory();
  }, [currentUser?._id, currentUser?.isAdmin]);

  const handleImageUpload = async () => {
    if (!file) {
      toast.error("Lütfen bir görsel seçin.");
      return;
    }
    try {
      const imageData = new FormData();
      imageData.append("file", file);
      imageData.append("upload_preset", "products");
      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: imageData }
      );
      const cloudinaryData = await cloudinaryRes.json();
      if (!cloudinaryRes.ok) {
        toast.error("Görsel yüklenemedi.");
        return;
      }
      setFormData({ ...formData, image: cloudinaryData.secure_url });
      toast.success("Görsel yüklendi.");
    } catch {
      toast.error("Yükleme sırasında hata oluştu.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      toast.error("Başlık ve fiyat zorunludur.");
      return;
    }
    try {
      const productData = {
        title: formData.title,
        price: formData.price,
        stock: formData.stock,
        content: formData.content,
        image: formData.image,
        category: formData.category,
      };
      const res = await fetch("/server/product/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }
      toast.success("Ürün oluşturuldu.");
      navigate("/panel?tab=products");
    } catch {
      toast.error("Kayıt sırasında hata oluştu.");
    }
  };

  return (
    <div className={`${shell} flex justify-center px-4 py-8`}>
      <div className={formCard}>
        <h1 className={formTitle}>Yeni ürün</h1>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className={inputRow}>
            <TextInput
              type="text"
              placeholder="Başlık"
              required
              id="title"
              className="min-w-0 flex-1"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <TextInput
              type="text"
              placeholder="Fiyat"
              required
              id="price"
              className="min-w-0 flex-1"
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
            <TextInput
              type="text"
              placeholder="Stok"
              required
              id="stock"
              className="min-w-0 flex-1"
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
            />
            <Select
              id="category"
              required
              className="min-w-0 flex-1"
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="">Kategori seçin</option>
              {userCategory?.map((ctg) => (
                <option key={ctg._id ?? ctg.name} value={ctg.name}>
                  {ctg.name}
                </option>
              ))}
            </Select>
          </div>
          <div className={uploadZone}>
            <FileInput
              type="file"
              accept="image/*"
              className="w-full"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <Button
              type="button"
              onClick={handleImageUpload}
              className="shrink-0 bg-emerald-600 enabled:hover:bg-emerald-700"
            >
              Görsel yükle
            </Button>
          </div>
          <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-2 dark:border-gray-600 dark:bg-gray-900/40">
            <ReactQuill
              theme="snow"
              placeholder="Açıklama..."
              className="mb-12 min-h-[12rem] bg-white dark:bg-gray-800"
              onChange={(value) => setFormData({ ...formData, content: value })}
            />
          </div>
          <button type="submit" className={`${btnPrimary} w-full`}>
            Yayınla
          </button>
        </form>
      </div>
    </div>
  );
}
