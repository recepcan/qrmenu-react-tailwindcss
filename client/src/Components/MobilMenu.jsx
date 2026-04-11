import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toggleMenu } from "../store/headerSlice";

function MobilMenu() {
  const dispatch = useDispatch();
  const { mobilMenu } = useSelector((state) => state.header);

  const linkClass =
    "flex w-full items-center justify-center rounded-xl border border-stone-200 bg-white py-3 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 dark:border-gray-600 dark:bg-gray-800 dark:text-stone-100 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/40";

  return (
    <div
      className={`absolute left-0 right-0 top-full overflow-hidden border-b border-stone-200/90 bg-white/95 backdrop-blur-md transition-all duration-300 ease-out dark:border-gray-700/90 dark:bg-gray-900/95 sm:hidden ${
        mobilMenu
          ? "max-h-[min(70vh,420px)] opacity-100"
          : "max-h-0 opacity-0 pointer-events-none"
      }`}
      id="mobile-nav"
      aria-hidden={!mobilMenu}
    >
      <nav
        className="flex flex-col gap-2 px-4 py-4"
        aria-label="Mobil menü"
      >
        <Link
          to="/panel?tab=profile"
          className={linkClass}
          onClick={() => dispatch(toggleMenu())}
        >
          Panel
        </Link>
        <Link
          to="/sign-in"
          className={linkClass}
          onClick={() => dispatch(toggleMenu())}
        >
          Giriş
        </Link>
        <Link
          to="/sign-up"
          className="flex w-full items-center justify-center rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          onClick={() => dispatch(toggleMenu())}
        >
          Kayıt ol
        </Link>
      </nav>
    </div>
  );
}

export default MobilMenu;
