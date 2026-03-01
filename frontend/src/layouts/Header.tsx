import UploadFilesDialog from "@/components/files/dialogs/UploadFilesDialog";
import { CreateFolderDialog } from "@/components/folders/dialogs/CreateFolderDialog";
import { ThemeToggle } from "@/components/themeToggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Notifications from "./Notifications";

export default function Header() {
  return (
    <div className="sticky top-0 left-0 flex items-center justify-between p-3 border-b shadow-md z-20 bg-background">
      <SidebarTrigger />
      <div className="flex items-center gap-2">
        <Notifications />
        <CreateFolderDialog />
        <UploadFilesDialog />
        <ThemeToggle />
      </div>
    </div>
  );
}
