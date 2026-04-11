/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../../store/userSlice";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaSignOutAlt,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { MdCreateNewFolder } from "react-icons/md";
import { BiSolidCategory } from "react-icons/bi";
import { CgWebsite } from "react-icons/cg";
import { HiPhotograph } from "react-icons/hi";

function NavPill({ to, active, children, icon }) {
  return (
    <Link
      to={to}
      className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition sm:px-4 ${
        active
          ? "border-emerald-500/80 bg-emerald-600 text-white shadow-sm dark:border-emerald-600"
          : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50 dark:border-gray-600 dark:bg-gray-800 dark:text-stone-200 dark:hover:border-gray-500 dark:hover:bg-gray-700/50"
      }`}
    >
      <span className="text-lg opacity-90" aria-hidden>
        {icon}
      </span>
      <span className="max-md:sr-only sm:inline">{children}</span>
    </Link>
  );
}

function SubMenu({ label, icon, active, items }) {
  return (
    <details
      className={`group relative shrink-0 rounded-xl border ${
        active
          ? "border-emerald-500/80 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/40"
          : "border-stone-200 bg-white dark:border-gray-600 dark:bg-gray-800"
      }`}
    >
      <summary
        className="flex cursor-pointer list-none items-center gap-2 px-3 py-2 text-sm font-semibold text-stone-800 dark:text-stone-100 sm:px-4 [&::-webkit-details-marker]:hidden"
      >
        <span className="text-lg" aria-hidden>
          {icon}
        </span>
        <span className="max-md:sr-only sm:inline">{label}</span>
        <span className="text-xs text-stone-400 dark:text-gray-500 md:hidden">
          ▾
        </span>
      </summary>
      <div className="absolute left-0 top-full z-50 mt-1 min-w-[11rem] rounded-xl border border-stone-200 bg-white py-1 shadow-lg dark:border-gray-600 dark:bg-gray-800">
        {items.map((item) => (
          <Link
            key={item.link}
            to={item.link}
            className="block px-4 py-2.5 text-sm text-stone-700 transition hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-gray-700/80"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </details>
  );
}

function DashSidebar({ activeTab }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const onPanel = location.pathname === "/panel";

  const handleSignout = async () => {
    try {
      const res = await fetch("/server/user/signout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) toast.error(data.message);
      else dispatch(signoutSuccess());
    } catch (error) {
      toast.error(error?.message ?? "Çıkış yapılamadı.");
    }
  };

  const showAdd =
    onPanel &&
    (activeTab === "category" ||
      activeTab === "products" ||
      activeTab === "home");

  const addHref =
    activeTab === "category"
      ? "/create-category"
      : activeTab === "home"
        ? "/create-home"
        : "/create-product";

  const addLabel =
    activeTab === "category"
      ? "Kategori ekle"
      : activeTab === "home"
        ? "Anasayfa ekle"
        : "Ürün ekle";

  return (
    <div className="sticky top-14 z-30 border-b border-stone-200/80 bg-white/90 backdrop-blur-md dark:border-gray-700/80 dark:bg-gray-900/90 sm:top-16">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-stone-300 dark:scrollbar-thumb-gray-600 sm:pb-0 md:gap-3">
          <NavPill
            to="/panel?tab=profile"
            active={activeTab === "profile" || activeTab === ""}
            icon={<FaUser />}
          >
            Profil
          </NavPill>

          <SubMenu
            label="Ürünler"
            icon={<MdCreateNewFolder />}
            active={activeTab === "products"}
            items={[
              { title: "Tüm ürünler", link: "/panel?tab=products" },
              { title: "Yeni ürün", link: "/create-product" },
            ]}
          />

          <SubMenu
            label="Kategoriler"
            icon={<BiSolidCategory />}
            active={activeTab === "category"}
            items={[
              { title: "Tüm kategoriler", link: "/panel?tab=category" },
              { title: "Yeni kategori", link: "/create-category" },
            ]}
          />

          <SubMenu
            label="Anasayfa"
            icon={<HiPhotograph />}
            active={activeTab === "home"}
            items={[
              { title: "Tüm kayıtlar", link: "/panel?tab=home" },
              { title: "Yeni kayıt", link: "/create-home" },
            ]}
          />

          {currentUser?.isOwner && (
            <NavPill
              to="/panel?tab=users"
              active={activeTab === "users"}
              icon={<FaUsers />}
            >
              Kullanıcılar
            </NavPill>
          )}

          {currentUser?.username && (
            <NavPill
              to={`/${currentUser.username}`}
              active={false}
              icon={<CgWebsite />}
            >
              Canlı menü
            </NavPill>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {showAdd && (
            <Link
              to={addHref}
              className="flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 sm:px-4"
            >
              <FaPlus className="text-base" aria-hidden />
              <span className="hidden sm:inline">{addLabel}</span>
            </Link>
          )}
          {onPanel && (
            <button
              type="button"
              onClick={handleSignout}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-gray-600 dark:bg-gray-800 dark:text-stone-300 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-300"
              aria-label="Çıkış yap"
            >
              <FaSignOutAlt className="text-lg" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashSidebar;
