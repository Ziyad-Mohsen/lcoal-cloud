import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useUploadedFiles,
  type FileWithProgress,
} from "@/contexts/UploadedFilesContext";
import { ArrowRight, CloudUpload, Upload, X } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import UploadFileCard from "./UploadFileCard";
import { useStoragePath } from "@/hooks/useStoragePath";
import { generateId } from "@/lib/utils";
import { toast } from "sonner";

export default function UploadFilesDialog() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { selectedFiles, setSelectedFiles, uploadFiles } = useUploadedFiles();
  const { pathname } = useStoragePath();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const newFiles: FileWithProgress[] = Array.from(e.target.files).map(
      (file) => ({
        id: generateId(),
        file,
        progress: 0,
        state: "waiting...",
        uploaded: false,
        controller: new AbortController(),
      }),
    );

    setSelectedFiles(newFiles);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemove = (id: string) => {
    setSelectedFiles((state) => state.filter((item) => item.id !== id));
  };

  const handleClear = () => {
    setSelectedFiles([]);
  };

  const handleUpload = () => {
    uploadFiles({
      pathname,
      onAbort: () => {
        toast("Upload file cancelled");
      },
      onDone: () => {
        setIsOpen(false);
        setSelectedFiles([]);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          Upload <Upload />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0">
        <DialogHeader className="p-5 border-b">
          <DialogTitle>Upload Files</DialogTitle>
        </DialogHeader>
        <div className="max-h-[50vh] overflow-y-auto px-4">
          <div className="flex items-center justify-around border-2 border-dashed bg-secondary rounded-lg p-10">
            <div className="flex flex-col items-center gap-4">
              <div className="text-primary bg-primary/20 p-5 rounded-full">
                <CloudUpload />
              </div>
              <div className="text-center">
                <p>Drag and drop files here</p>
                <span className="text-sm text-muted-foreground">
                  or click to choose from your computer
                </span>
              </div>
              <Button
                variant="outline"
                className="border-primary! text-primary"
              >
                <input
                  type="file"
                  ref={inputRef}
                  onChange={handleFileSelect}
                  multiple
                  id="file-upload"
                  className="hidden"
                />
                <label htmlFor="file-upload">Browse files</label>
              </Button>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground py-4">
              <p>FILES TO UPLOAD</p>
              {selectedFiles.length > 0 && (
                <Button variant="ghost" size="sm" onClick={handleClear}>
                  Remove all <X />
                </Button>
              )}
              <span>
                {`${selectedFiles.length} ${selectedFiles.length == 1 ? "file" : "files"}`}{" "}
                selected
              </span>
            </div>
            <div className="flex flex-col gap-2 pb-2">
              {selectedFiles.map((item) => {
                return (
                  <UploadFileCard
                    key={item.id}
                    uploadedFile={item}
                    onRemove={() => handleRemove(item.id)}
                    compact
                  />
                );
              })}
            </div>
          </div>
        </div>
        <DialogFooter className="p-5 bg-secondary">
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={handleUpload}>
            Upload All <ArrowRight />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
