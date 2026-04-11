import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "./DashSidebar";
import DashProducts from "./DashProducts";
import DashCategory from "./DashCategory";
import DashHome from "./DashHome";
import Users from "./Users";
import Profile from "./Profile";
import { mainInner, shell } from "./adminUi";

function Panel() {
  const location = useLocation();
  const [tab, setTab] = useState("profile");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) setTab(tabFromUrl);
    else setTab("profile");
  }, [location.search]);

  return (
    <div className={shell}>
      <DashSidebar activeTab={tab} />
      <main className={mainInner}>
        {tab === "products" && <DashProducts />}
        {tab === "users" && <Users />}
        {tab === "category" && <DashCategory />}
        {tab === "home" && <DashHome />}
        {(tab === "profile" || tab === "") && <Profile />}
      </main>
    </div>
  );
}

export default Panel;
