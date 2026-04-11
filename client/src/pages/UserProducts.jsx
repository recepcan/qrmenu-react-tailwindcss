import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { HiViewGrid, HiViewList } from "react-icons/hi";
import { toggleProductStyle } from "../store/productSlice";

function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function excerptFromHtml(html, maxLen = 100) {
  const text = stripHtml(html);
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen).trim()}…`;
}

function UserProducts() {
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const [userProducts, setUserProducts] = useState([]);
  const { productStyleColumn } = useSelector((state) => state.product);
  const navigate = useNavigate();

  const categoryLabel = tab
    ? decodeURIComponent(tab).replace(/-/g, " ")
    : "Menü";

  const openModal = useCallback((product) => {
    setSelectedProduct(product);
    setModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setModal(false);
    setSelectedProduct(null);
  }, []);

  useEffect(() => {
    if (modal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modal]);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal, closeModal]);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const qs = new URLSearchParams({ username });
        if (tab) qs.set("category", tab);
        const res = await fetch(`/server/product/getproducts?${qs.toString()}`);
        if (!res.ok) throw new Error("Ürünler yüklenemedi.");
        const data = await res.json();
        if (!cancelled) setUserProducts(data.products ?? []);
      } catch (error) {
        if (!cancelled) setFetchError(error.message ?? "Bir hata oluştu.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (username) fetchProducts();
    else {
      setLoading(false);
      setFetchError("Kullanıcı bulunamadı.");
    }

    return () => {
      cancelled = true;
    };
  }, [username, tab]);

  const gridClass = productStyleColumn
    ? "grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 w-full max-w-6xl px-4 sm:px-5"
    : "flex flex-col gap-3 sm:gap-4 w-full max-w-3xl px-4 sm:px-5";

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
              Kategori
            </p>
            <h1 className="truncate text-lg font-semibold capitalize tracking-tight text-stone-900 dark:text-white sm:text-xl">
              {categoryLabel}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => dispatch(toggleProductStyle())}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-sm transition ${
              productStyleColumn
                ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                : "border-stone-200 bg-white text-stone-600 dark:border-gray-600 dark:bg-gray-800 dark:text-stone-300"
            }`}
            aria-label={
              productStyleColumn
                ? "Liste görünümüne geç"
                : "Izgara görünümüne geç"
            }
            aria-pressed={productStyleColumn}
          >
            {productStyleColumn ? (
              <HiViewList className="text-xl" aria-hidden />
            ) : (
              <HiViewGrid className="text-xl" aria-hidden />
            )}
          </button>
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
                className={`overflow-hidden rounded-2xl border border-stone-200/80 bg-white dark:border-gray-700 dark:bg-gray-800 ${
                  productStyleColumn ? "flex flex-col" : "flex gap-4 p-3"
                }`}
              >
                {productStyleColumn ? (
                  <>
                    <div className="aspect-[4/3] bg-stone-200 dark:bg-gray-700" />
                    <div className="space-y-2 p-4">
                      <div className="h-4 w-3/4 rounded bg-stone-200 dark:bg-gray-700" />
                      <div className="h-3 w-full rounded bg-stone-100 dark:bg-gray-600" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="h-24 w-24 shrink-0 rounded-xl bg-stone-200 dark:bg-gray-700" />
                    <div className="flex flex-1 flex-col justify-center gap-2 py-1">
                      <div className="h-4 w-2/3 rounded bg-stone-200 dark:bg-gray-700" />
                      <div className="h-3 w-full rounded bg-stone-100 dark:bg-gray-600" />
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}

        {!loading && fetchError && (
          <div className="mx-4 mt-8 max-w-md rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-center dark:border-red-900/50 dark:bg-red-950/40">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              {fetchError}
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

        {!loading && !fetchError && userProducts?.length === 0 && (
          <div className="mx-4 mt-12 max-w-sm rounded-2xl border border-dashed border-stone-300 bg-white/80 px-6 py-10 text-center dark:border-gray-600 dark:bg-gray-800/80">
            <p className="text-stone-600 dark:text-gray-300">
              Bu kategoride henüz ürün yok.
            </p>
          </div>
        )}

        {!loading && !fetchError && userProducts?.length > 0 && (
          <ul className={gridClass} role="list">
            {userProducts.map((product) => {
              const inStock = product.stock > 0;
              const excerpt = excerptFromHtml(product?.content);

              return (
                <li key={product._id ?? product.title}>
                  <button
                    type="button"
                    onClick={() => openModal(product)}
                    className={`group w-full text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 ${
                      productStyleColumn
                        ? "flex flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-sm hover:border-stone-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/90 dark:hover:border-gray-600"
                        : "flex w-full gap-4 overflow-hidden rounded-2xl border border-stone-200/90 bg-white p-3 shadow-sm hover:border-stone-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/90 dark:hover:border-gray-600 sm:gap-5 sm:p-4"
                    } ${!inStock ? "opacity-90" : ""}`}
                  >
                    {productStyleColumn ? (
                      <>
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 dark:bg-gray-900">
                          <img
                            src={product.image}
                            alt={product.title || "Ürün"}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                          />
                          {!inStock && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[2px]">
                              <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-stone-800 shadow dark:bg-gray-900 dark:text-stone-100">
                                Tükendi
                              </span>
                            </div>
                          )}
                          <span className="absolute bottom-3 right-3 rounded-full bg-gray-900/90 px-3 py-1.5 text-sm font-bold tabular-nums text-emerald-400 shadow-lg">
                            {product.price} ₺
                          </span>
                        </div>
                        <div className="flex flex-1 flex-col gap-1 p-4 pt-3">
                          <h2 className="line-clamp-2 text-base font-semibold leading-snug text-stone-900 dark:text-white">
                            {product.title}
                          </h2>
                          {excerpt && (
                            <p className="line-clamp-2 text-sm leading-relaxed text-stone-500 dark:text-gray-400">
                              {excerpt}
                            </p>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-stone-100 sm:h-28 sm:w-28 dark:bg-gray-900">
                          <img
                            src={product.image}
                            alt={product.title || "Ürün"}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                          />
                          {!inStock && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                              <span className="rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-bold uppercase text-stone-800">
                                Tükendi
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                          <h2 className="line-clamp-2 text-base font-semibold text-stone-900 dark:text-white">
                            {product.title}
                          </h2>
                          {excerpt && (
                            <p className="line-clamp-2 text-sm text-stone-500 dark:text-gray-400">
                              {excerpt}
                            </p>
                          )}
                          <p className="mt-1 text-lg font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                            {product.price} ₺
                          </p>
                        </div>
                      </>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {modal && selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
          onClick={closeModal}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
            className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl dark:bg-gray-800 sm:max-h-[85vh] sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-stone-700 shadow-md backdrop-blur-sm transition hover:bg-white dark:bg-gray-700/90 dark:text-stone-100 dark:hover:bg-gray-700"
              aria-label="Kapat"
            >
              <IoCloseSharp className="text-xl" />
            </button>

            <div className="shrink-0 overflow-hidden bg-stone-100 dark:bg-gray-900">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title || "Ürün"}
                className="mx-auto max-h-56 w-full object-cover sm:max-h-64"
              />
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-5 pt-4">
              <h2
                id="product-modal-title"
                className="pr-10 text-xl font-bold text-stone-900 dark:text-white"
              >
                {selectedProduct.title}
              </h2>
              <div
                className="text-[15px] leading-relaxed text-stone-600 dark:text-gray-300 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{
                  __html: selectedProduct?.content ?? "",
                }}
              />
              <div className="sticky bottom-0 mt-auto border-t border-stone-100 bg-white pt-4 dark:border-gray-700 dark:bg-gray-800">
                <p className="text-center text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                  {selectedProduct.price} ₺
                </p>
                {selectedProduct.stock <= 0 && (
                  <p className="mt-2 text-center text-sm font-medium text-red-600 dark:text-red-400">
                    Bu ürün şu an hizmette değil.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProducts;
