import { ArrowLeft, CloudUpload } from "lucide-react";
import UploadFilesDialog from "@/components/files/dialogs/UploadFilesDialog";
import { CreateFolderDialog } from "@/components/folders/dialogs/CreateFolderDialog";
import { Fragment } from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export function NoFilesComponent() {
  const navigate = useNavigate();
  return (
    <div className="col-span-full h-96 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-6 text-center px-4">
        <div className="w-full flex justify-start">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => {
              navigate("..", { relative: "path" });
            }}
          >
            <ArrowLeft />
          </Button>
        </div>
        {/* Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-2xl"></div>
          <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 rounded-full p-6 border border-border/50">
            <CloudUpload
              size={64}
              className="text-primary animate-pulse"
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-foreground">No files yet</h3>
          <p className="text-muted-foreground max-w-xs">
            Start by uploading files or creating folders to organize your
            storage.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Fragment>
            <UploadFilesDialog />
          </Fragment>

          <Fragment>
            <CreateFolderDialog />
          </Fragment>
        </div>
      </div>
    </div>
  );
}
