import { getStorageInfo as getStorageUsage } from "@/api/files.api";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { formatFileSize } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Bookmark, Folder, Home, RotateCcw, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants";
import { useQuickAccess } from "@/contexts/QuickAccessContext";

type NavigationMenuItem = {
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
};

const NavigationItems: NavigationMenuItem[] = [
  { href: ROUTES.ROOT, icon: Home, label: "Home" },
  { href: ROUTES.STORAGE, icon: Folder, label: "Storage" },
];

const progressColors = {
  low: "green",
  mid: "yellow",
  high: "orange",
  ultra: "red",
};

const getProgressColor = (value: number): string => {
  if (value <= 40) {
    return progressColors.low;
  }
  if (value > 40 && value <= 60) {
    return progressColors.mid;
  }
  if (value > 60 && value <= 80) {
    return progressColors.high;
  }
  if (value > 80) {
    return progressColors.ultra;
  }
  return progressColors.low;
};

export function AppSidebar() {
  const { quickAccessFolders, setQuickAccessFolders } = useQuickAccess();
  const { pathname } = useLocation();
  const {
    data: storageUsage,
    isPending,
    isError,
    refetch,
  } = useQuery({ queryKey: ["storageInfo"], queryFn: getStorageUsage });
  const progressColor = getProgressColor(storageUsage?.percentage || 0);

  const firstSegment = pathname.split("/")[1];
  const activeRoute = firstSegment ? `/${firstSegment}` : ROUTES.ROOT;

  return (
    <Sidebar>
      <SidebarHeader className="p-3">
        <SidebarMenu>
          <Logo />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="p-2">
        {/* Navigation Menu */}
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            {NavigationItems.map((item) => (
              <SidebarMenuItem
                key={item.href}
                className="flex items-center gap-2"
              >
                <SidebarMenuButton
                  asChild
                  isActive={item.href === activeRoute}
                  className="cursor-pointer"
                >
                  <Link to={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>

        {/* Quick access */}
        <SidebarGroupLabel className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Bookmark className="h-3.5 w-3.5" />
          <span>Quick access</span>
        </SidebarGroupLabel>
        <SidebarGroupContent className="flex flex-col flex-1 overflow-scroll no-scrollbar gap-1">
          {quickAccessFolders.length === 0 ? (
            <div className="px-2 py-2 text-xs text-muted-foreground">
              No quick access folders yet.
            </div>
          ) : (
            <SidebarMenu>
              {quickAccessFolders.map((folder) => (
                <SidebarMenuItem
                  key={`${folder.path}-${folder.name}`}
                  className="flex items-center gap-2"
                >
                  <SidebarMenuButton asChild className="h-fit">
                    <Link to={folder.path} className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Folder className="h-4 w-4 text-primary" />
                        <div className="flex flex-col items-start">
                          <span className="truncate">{folder.name}</span>
                          <span className="text-xs text-muted-foreground truncate">
                            {folder.path}
                          </span>
                        </div>
                      </div>
                      <Button
                        className="rounded-full w-6 h-6 hover:bg-destructive dark:hover:bg-destructive hover:text-destructive-foreground dark:hover:text-destructive-foreground"
                        size="icon-sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setQuickAccessFolders((prevFolders) =>
                            prevFolders.filter(
                              (prevFolder) =>
                                prevFolder.path + prevFolder.name !==
                                folder.path + folder.name,
                            ),
                          );
                        }}
                      >
                        <X size={8} />
                      </Button>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          )}
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarFooter className="mt-auto border-t p-3">
        {isPending ? (
          <div className="flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sidebar-foreground">
              <span>Storage Usage</span>
              <div>
                <span className="text-sm">
                  {storageUsage?.percentage.toFixed(2)}%
                </span>
                {isError && (
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => refetch()}
                  >
                    <RotateCcw />
                  </Button>
                )}
              </div>
            </div>
            <Progress
              className="h-1.5"
              color={progressColor}
              value={storageUsage?.percentage}
            />
            <span className="flex items-center justify-between text-sm text-bold text-muted-foreground">
              {formatFileSize(storageUsage?.size || 0, 2, "GB")} of{" "}
              {formatFileSize(storageUsage?.maxSize || 0, 0, "GB")}
            </span>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
