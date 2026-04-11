import { Button, FileInput, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  btnPrimary,
  formCard,
  formTitle,
  inputRow,
  shell,
  uploadZone,
} from "./adminUi";

export default function UpdateCategory() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(
          `/server/category/getcategory?categoryId=${categoryId}`
        );
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.message);
          return;
        }
        setFormData(data.category[0]);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchCategory();
  }, [categoryId]);

  const handleImageUpload = async () => {
    if (!file) {
      toast.error("Lütfen bir görsel seçin.");
      return;
    }
    try {
      const imageData = new FormData();
      imageData.append("file", file);
      imageData.append("upload_preset", "categories");
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
      setFormData({ ...formData, image: cloudinaryData.secure_url });
    } catch {
      toast.error("Yükleme sırasında hata oluştu.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `/server/category/updatecategory/${formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }
      toast.success("Kategori güncellendi.");
      navigate("/panel?tab=category");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className={`${shell} flex justify-center px-4 py-8`}>
      <div className={formCard}>
        <h1 className={formTitle}>Kategoriyi düzenle</h1>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className={inputRow}>
            <TextInput
              type="text"
              placeholder="Başlık"
              required
              id="title"
              className="min-w-0 flex-1"
              value={formData.title ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <TextInput
              type="text"
              placeholder="Ad"
              required
              id="name"
              className="min-w-0 flex-1"
              value={formData.name ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className={uploadZone}>
            <FileInput
              type="file"
              accept="image/*"
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
          {formData.image && !file && (
            <img
              src={formData.image}
              alt=""
              className="max-h-72 w-full rounded-xl border border-stone-200 object-contain dark:border-gray-600"
            />
          )}
          <button type="submit" className={`${btnPrimary} w-full`}>
            Güncelle
          </button>
        </form>
      </div>
    </div>
  );
}
