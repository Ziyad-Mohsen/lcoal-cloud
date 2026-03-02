import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2Icon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useStoragePath } from "@/hooks/useStoragePath";
import { deleteFile } from "@/api/files.api";
import type { FileDialogProps } from "./types";
import { QUERY_KEYS, type QueryKeyType } from "@/lib/queryClient";

export default function DeleteFileDialog({
  open = false,
  setIsOpen,
  file,
}: FileDialogProps) {
  const queryClient = useQueryClient();
  const path = useStoragePath();
  const deleteMutation = useMutation({
    mutationFn: deleteFile,
    onSuccess: (data) => {
      setIsOpen(false);
      toast(data.message);
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKeys: QueryKeyType[] = [
            QUERY_KEYS.FILES,
            QUERY_KEYS.STORAGE_INFO,
          ];
          return queryKeys.includes(query.queryKey[0] as QueryKeyType);
        },
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDelete = () => {
    const filePath = decodeURIComponent(path.join(file.name));
    deleteMutation.mutate(filePath as string);
  };

  return (
    <AlertDialog open={open} onOpenChange={setIsOpen}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete File?</AlertDialogTitle>
          <AlertDialogDescription>
            This will <span className="text-destructive">permanently</span>{" "}
            delete this file. This action cannot be undone. Make sure you no
            longer need these file.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <>
                Deleting <Spinner />
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
