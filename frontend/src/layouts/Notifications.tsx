import UploadFileCard from "@/components/files/dialogs/UploadFileCard";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUploadedFiles } from "@/contexts/UploadedFilesContext";
import { Bell, CircleCheckBig } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function Notifications() {
  const { uploadedFiles, setUploadedFiles, abortFileUpload } =
    useUploadedFiles();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const newFilesCount = useMemo<number>(() => {
    return uploadedFiles.reduce((total, currentFile) => {
      if (currentFile.isNew) {
        return total + 1;
      } else {
        return total;
      }
    }, 0);
  }, [uploadedFiles]);

  useEffect(() => {
    if (isOpen) {
      setUploadedFiles((prevFiles) =>
        prevFiles.map((file) => ({ ...file, isNew: false })),
      );
    }
  }, [isOpen, setUploadedFiles]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button className="relative" variant="outline" size="icon">
          {newFilesCount > 0 && (
            <div className="absolute w-2 h-2 bg-red-400 -top-1 -right-1 rounded-full" />
          )}
          <Bell />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="min-w-100">
        <PopoverHeader>
          <PopoverTitle>Notifications</PopoverTitle>
        </PopoverHeader>
        <div className="max-h-100 overflow-y-auto flex flex-col gap-2 py-2">
          {uploadedFiles.length ? (
            uploadedFiles.map((item) => {
              return (
                <UploadFileCard
                  key={item.id}
                  uploadedFile={item}
                  onRemove={() => {
                    abortFileUpload(item.id);
                  }}
                />
              );
            })
          ) : (
            <div className="mx-auto space-y-2 items-center text-sm text-muted-foreground">
              <CircleCheckBig className="mx-auto" />
              <p>When you get updates, they’ll appear here.</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
