import { Routes, Route } from "react-router-dom";
import Storage from "@/pages/Storage";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./layouts/AppSidebar";
import { ROUTES } from "./constants";
import Home from "./pages/Home";
import Header from "./layouts/Header";

export default function App() {
  return (
    <>
      <SidebarProvider className="flex h-screen">
        <div className="flex items-stretch w-full">
          <AppSidebar />
          <div className="flex-1 overflow-x-hidden overflow-y-auto">
            <Header />
            <Routes>
              <Route path={ROUTES.ROOT} element={<Home />} />
              <Route path={`${ROUTES.STORAGE}/*`} element={<Storage />} />
              <Route path="*" element={<div>Not found</div>} />
            </Routes>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
