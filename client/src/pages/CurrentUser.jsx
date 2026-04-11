import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { IoMdArrowRoundBack } from "react-icons/io";

function CurrentUser() {
  const [userCategory, setUserCategory] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [userError, setUserError] = useState(null);
  const [categoriesError, setCategoriesError] = useState(null);
  const { username } = useParams();
  const navigate = useNavigate();

  const displayUsername = username
    ? decodeURIComponent(username)
    : "";

  useEffect(() => {
    let cancelled = false;

    const fetchUser = async () => {
      setLoadingUser(true);
      setUserError(null);
      try {
        const response = await fetch(
          `/server/user/username/${encodeURIComponent(username)}`
        );
        if (!response.ok) {
          if (!cancelled) {
            setUserError("Bu kullanıcı bulunamadı.");
            setUserCategory([]);
          }
          return;
        }
        await response.json();
      } catch (error) {
        const msg = error?.message ?? "Bağlantı hatası.";
        if (!cancelled) {
          setUserError(msg);
          toast.error(msg);
        }
      } finally {
        if (!cancelled) setLoadingUser(false);
      }
    };

    if (username) fetchUser();
    else {
      setLoadingUser(false);
      setUserError("Geçersiz adres.");
    }

    return () => {
      cancelled = true;
    };
  }, [username]);

  useEffect(() => {
    let cancelled = false;

    const fetchCategory = async () => {
      setLoadingCategories(true);
      setCategoriesError(null);
      try {
        const res = await fetch(
          `/server/category/getcategory?username=${encodeURIComponent(username)}`
        );
        const data = await res.json();
        if (!res.ok) {
          if (!cancelled) {
            setCategoriesError(data?.message ?? "Kategoriler yüklenemedi.");
          }
          return;
        }
        if (!cancelled) setUserCategory(data.category ?? []);
      } catch (error) {
        const msg = error?.message ?? "Kategoriler yüklenemedi.";
        if (!cancelled) {
          setCategoriesError(msg);
          toast.error(msg);
        }
      } finally {
        if (!cancelled) setLoadingCategories(false);
      }
    };

    if (username) fetchCategory();
    else setLoadingCategories(false);

    return () => {
      cancelled = true;
    };
  }, [username]);

  const loading = loadingUser || loadingCategories;
  const gridClass =
    "grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 w-full max-w-6xl px-4 sm:px-5";

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gradient-to-b from-stone-50 to-stone-100 dark:from-gray-900 dark:to-gray-950 pb-28">
      <header className="sticky top-14 z-40 w-full border-b border-stone-200/80 bg-white/85 px-4 py-3 backdrop-blur-md dark:border-gray-700/80 dark:bg-gray-900/85 sm:top-16 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-700 shadow-sm transition hover:bg-stone-50 dark:border-gray-600 dark:bg-gray-800 dark:text-stone-200 dark:hover:bg-gray-700/50"
            aria-label="Geri dön"
          >
            <IoMdArrowRoundBack className="text-xl" />
          </button>

          <div className="min-w-0 flex-1 text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-stone-400 dark:text-gray-500 sm:text-xs">
              Menü
            </p>
            <h1 className="truncate text-lg font-semibold tracking-tight text-stone-900 dark:text-white sm:text-xl">
              @{displayUsername}
            </h1>
          </div>

          <div
            className="h-11 w-11 shrink-0"
            aria-hidden
          />
        </div>
      </header>

      <div className="mt-6 w-full flex flex-1 flex-col items-center">
        {loading && (
          <ul
            className={`${gridClass} animate-pulse`}
            aria-hidden
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <li
                key={i}
                className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="aspect-[4/3] bg-stone-200 dark:bg-gray-700" />
                <div className="space-y-2 p-4">
                  <div className="mx-auto h-4 w-3/4 rounded bg-stone-200 dark:bg-gray-700" />
                </div>
              </li>
            ))}
          </ul>
        )}

        {!loading && userError && (
          <div className="mx-4 mt-8 max-w-md rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-center dark:border-red-900/50 dark:bg-red-950/40">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              {userError}
            </p>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-4 text-sm font-semibold text-red-700 underline dark:text-red-300"
            >
              Geri dön
            </button>
          </div>
        )}

        {!loading && !userError && categoriesError && (
          <div className="mx-4 mt-8 max-w-md rounded-2xl border border-amber-200 bg-amber-50 px-5 py-6 text-center dark:border-amber-900/50 dark:bg-amber-950/40">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
              {categoriesError}
            </p>
          </div>
        )}

        {!loading && !userError && !categoriesError && userCategory.length === 0 && (
          <div className="mx-4 mt-12 max-w-sm rounded-2xl border border-dashed border-stone-300 bg-white/80 px-6 py-10 text-center dark:border-gray-600 dark:bg-gray-800/80">
            <p className="text-stone-600 dark:text-gray-300">
              Henüz kategori eklenmemiş.
            </p>
          </div>
        )}

        {!loading && !userError && userCategory.length > 0 && (
          <ul className={gridClass} role="list">
            {userCategory.map((ctg) => (
              <li key={ctg._id ?? ctg.name}>
                <Link
                  to={`products?tab=${encodeURIComponent(ctg.name)}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-sm transition hover:border-stone-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800/90 dark:hover:border-gray-600 dark:focus-visible:ring-offset-gray-900"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 dark:bg-gray-900">
                    <img
                      src={ctg.image}
                      alt={ctg.title || ctg.name || "Kategori"}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col items-center justify-center gap-1 p-4 pt-3">
                    <h2 className="line-clamp-2 text-center text-base font-semibold leading-snug text-stone-900 dark:text-white">
                      {ctg.title}
                    </h2>
                    <span className="text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Ürünleri gör
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CurrentUser;
