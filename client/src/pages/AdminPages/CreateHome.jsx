import { TextInput } from "flowbite-react";
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

export default function CreateHome() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Görsel seçin.");
      return;
    }
    const homeData = new FormData();
    homeData.append("title", formData.title);
    homeData.append("name", formData.name);
    homeData.append("image", file);
    try {
      const res = await fetch("/server/home/create", {
        method: "POST",
        body: homeData,
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }
      navigate("/panel?tab=home");
    } catch {
      toast.error("Kayıt sırasında hata oluştu.");
    }
  };

  return (
    <div className={`${shell} flex justify-center px-4 py-8`}>
      <div className={formCard}>
        <h1 className={formTitle}>Yeni anasayfa kaydı</h1>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className={inputRow}>
            <TextInput
              type="text"
              placeholder="Başlık"
              id="title"
              className="min-w-0 flex-1"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <TextInput
              type="text"
              placeholder="Ad"
              id="name"
              className="min-w-0 flex-1"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className={uploadZone}>
            <input
              type="file"
              accept="image/*"
              className="w-full text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white dark:text-gray-300"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <button type="submit" className={`${btnPrimary} w-full`}>
            Kaydet
          </button>
        </form>
      </div>
    </div>
  );
}
