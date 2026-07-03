import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../dashboard/components/Sidebar";
import Topbar from "../dashboard/components/Topbar";
import { useAppSettings } from "../context/AppSettingsContext";
import { adminTitleKeys } from "../i18n/translations";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { t } = useAppSettings();
  const titleKey = adminTitleKeys[location.pathname];
  const title = titleKey ? t(titleKey) : t("admin.admin");

  return (
    <div className="flex min-h-screen bg-portek-bg">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          title={title}
        />

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
