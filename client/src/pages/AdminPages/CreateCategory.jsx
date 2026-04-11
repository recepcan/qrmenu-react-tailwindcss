import { Button, FileInput, TextInput } from "flowbite-react";
import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  btnPrimary,
  formCard,
  formTitle,
  inputRow,
  shell,
  uploadZone,
} from "./adminUi";

export default function CreateCategory() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({ title: "", name: "", image: "" });
  const navigate = useNavigate();

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
      setFormData({ ...formData, image: cloudinaryData.secure_url });
      toast.success("Görsel yüklendi.");
    } catch {
      toast.error("Yükleme sırasında hata oluştu.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.name || !formData.image) {
      toast.error("Tüm alanları doldurun ve görsel yükleyin.");
      return;
    }
    try {
      const res = await fetch("/server/category/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          name: formData.name,
          image: formData.image,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }
      toast.success("Kategori oluşturuldu.");
      navigate("/panel?tab=category");
    } catch {
      toast.error("Kayıt sırasında hata oluştu.");
    }
  };

  return (
    <div className={`${shell} flex justify-center px-4 py-8`}>
      <div className={formCard}>
        <h1 className={formTitle}>Yeni kategori</h1>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className={inputRow}>
            <TextInput
              type="text"
              placeholder="Başlık (görünen ad)"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <TextInput
              type="text"
              placeholder="Ad (URL / tab)"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className={uploadZone}>
            <FileInput
              required
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
          <button type="submit" className={`${btnPrimary} w-full`}>
            Kaydet
          </button>
        </form>
      </div>
    </div>
  );
}
