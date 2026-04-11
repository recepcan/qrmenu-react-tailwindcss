import { FileInput, TextInput } from "flowbite-react";
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

function homeImageSrc(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `http://localhost:5000${path}`;
}

export default function UpdateHome() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const { homeId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await fetch(`/server/home/gethome?homeId=${homeId}`);
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.message);
          return;
        }
        setFormData(data.home[0]);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchHome();
  }, [homeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const homeData = new FormData();
    homeData.append("title", formData.title);
    homeData.append("name", formData.name);
    if (file) homeData.append("image", file);
    else homeData.append("image", formData.image);

    try {
      const res = await fetch(
        `/server/home/updatehome/${formData._id}/${currentUser._id}`,
        { method: "PUT", body: homeData }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }
      toast.success("Kayıt güncellendi.");
      navigate("/panel?tab=home");
    } catch {
      toast.error("Güncelleme başarısız.");
    }
  };

  return (
    <div className={`${shell} flex justify-center px-4 py-8`}>
      <div className={formCard}>
        <h1 className={formTitle}>Anasayfa kaydını düzenle</h1>
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
          </div>
          {formData.image && (
            <img
              src={homeImageSrc(formData.image)}
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
