import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaMoon } from "react-icons/fa";
import { IoMdSunny } from "react-icons/io";
import { HiMenuAlt3 } from "react-icons/hi";
import MobilMenu from "./MobilMenu";
import { toggleMenu, toggleTheme } from "../store/headerSlice";

const ADMIN_LIKE_SEGMENTS = new Set([
  "sign-in",
  "sign-up",
  "panel",
  "create-product",
  "update-product",
  "create-category",
  "update-category",
  "create-home",
  "update-home",
]);

function Header() {
  const { theme, mobilMenu } = useSelector((state) => state.header);
  const dispatch = useDispatch();
  const location = useLocation();

  const pathParts = location.pathname.split("/").filter(Boolean);
  const firstSegment = pathParts[0] ?? "";
  const hideCenterUsername = ADMIN_LIKE_SEGMENTS.has(firstSegment);
  const displayUsername = firstSegment
    ? decodeURIComponent(firstSegment)
    : "";

  const navLinkClass =
    "rounded-xl px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-100 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-gray-800 dark:hover:text-white";

  const navCtaClass =
    "rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900";

  return (
    <header className="relative sticky top-0 z-50 w-full border-b border-stone-200/80 bg-white/90 backdrop-blur-md dark:border-gray-700/80 dark:bg-gray-900/90">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <button
            type="button"
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-700 shadow-sm transition hover:bg-stone-50 dark:border-gray-600 dark:bg-gray-800 dark:text-stone-200 dark:hover:bg-gray-700/50 sm:hidden ${
              mobilMenu ? "border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300" : ""
            }`}
            onClick={() => dispatch(toggleMenu())}
            aria-expanded={mobilMenu}
            aria-label="Menüyü aç veya kapat"
          >
            <HiMenuAlt3 className="text-xl" aria-hidden />
          </button>

          <nav
            className="hidden items-center gap-1 sm:flex"
            aria-label="Ana navigasyon"
          >
            <Link to="/panel?tab=profile" className={navLinkClass}>
              Panel
            </Link>
            <Link to="/sign-in" className={navLinkClass}>
              Giriş
            </Link>
            <Link to="/sign-up" className={navCtaClass}>
              Kayıt ol
            </Link>
          </nav>
        </div>

        <div className="flex min-w-0 flex-1 justify-center px-1">
          {!hideCenterUsername && displayUsername ? (
            <p
              className="truncate text-center text-base font-semibold tracking-tight text-stone-900 dark:text-white sm:text-lg"
              title={`@${displayUsername}`}
            >
              <span className="text-stone-400 dark:text-gray-500">@</span>
              {displayUsername}
            </p>
          ) : (
            <Link
              to="/sign-up"
              className="truncate text-center text-base font-semibold text-emerald-700 transition hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 sm:text-lg"
            >
              QR Menü
            </Link>
          )}
        </div>

        <div className="flex flex-1 items-center justify-end">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-700 shadow-sm transition hover:bg-stone-50 dark:border-gray-600 dark:bg-gray-800 dark:text-stone-200 dark:hover:bg-gray-700/50"
            onClick={() => dispatch(toggleTheme())}
            aria-label={theme === "light" ? "Koyu temaya geç" : "Açık temaya geç"}
          >
            {theme === "light" ? (
              <FaMoon className="text-lg text-stone-600" aria-hidden />
            ) : (
              <IoMdSunny className="text-xl text-amber-400" aria-hidden />
            )}
          </button>
        </div>
      </div>

      <MobilMenu />
    </header>
  );
}

export default Header;
