import { Card, CardFooter } from "@/components/ui/card";
import { DialogHeader } from "@/components/ui/dialog";
import {
  useUploadedFiles,
  type FileWithProgress,
} from "@/contexts/UploadedFilesContext";
import { getFileConfig } from "@/lib/fileTypeConfig";
import { formatFileSize } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UploadFileCard({
  uploadedFile,
  onRemove,
  compact,
}: {
  uploadedFile: FileWithProgress;
  onRemove?: () => void;
  compact?: boolean;
}) {
  const { getUploadStateColor } = useUploadedFiles();
  const uploadStateColor = getUploadStateColor(uploadedFile.state);
  const fileConfig = getFileConfig({ mimeType: uploadedFile.file.type });
  const Icon = fileConfig.icon;

  return (
    <Card key={uploadedFile.id} className="gap-4 py-3 px-4">
      <DialogHeader className="flex-row justify-between items-center max-w-full">
        {/* Icon */}
        <div
          className="p-3 rounded-lg"
          style={{
            backgroundColor: fileConfig.color + 40,
            color: fileConfig.color,
          }}
        >
          <Icon strokeWidth={1} />
        </div>
        {/* Text */}
        <div className="space-y-0 text-sm text-start flex-1">
          <p className="wrap-break-word text-wrap">{uploadedFile.file.name}</p>
          <p className="text-muted-foreground space-x-1 text-xs">
            <span>{formatFileSize(uploadedFile.file.size)}</span>
            {!compact && (
              <>
                <span>&bull;</span>
                <span>
                  {uploadedFile.state === "in progress" &&
                    uploadedFile.progress.toFixed(0) + "% "}
                  {uploadedFile.state}
                </span>
              </>
            )}
          </p>
        </div>
        {/* Remove Button */}
        <Button
          onClick={onRemove}
          size="icon-sm"
          variant="ghost"
          className="hover:bg-destructive/20 hover:text-destructive rounded-full"
        >
          <X size={16} strokeWidth={1} />
        </Button>
      </DialogHeader>
      {!compact && (
        <CardFooter className="p-0">
          <Progress
            className="h-1"
            color={uploadStateColor.hexCode}
            value={uploadedFile.progress}
            style={{}}
          />
        </CardFooter>
      )}
    </Card>
  );
}
