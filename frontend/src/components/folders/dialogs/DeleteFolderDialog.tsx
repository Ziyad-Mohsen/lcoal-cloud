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
import type { FileStats } from "../../../../../backend/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFolder } from "@/api/folders.api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useStoragePath } from "@/hooks/useStoragePath";
import { QUERY_KEYS, type QueryKeyType } from "@/lib/queryClient";

export default function DeleteFolderDialog({
  open = false,
  setIsOpen,
  folder,
}: {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  folder: FileStats;
}) {
  const queryClient = useQueryClient();
  const path = useStoragePath();
  const deleteMutation = useMutation({
    mutationFn: deleteFolder,
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
    const folderPath = path.join(folder.name);
    deleteMutation.mutate(folderPath as string);
  };

  return (
    <AlertDialog open={open} onOpenChange={setIsOpen}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete Folder?</AlertDialogTitle>
          <AlertDialogDescription>
            This will <span className="text-destructive">permanently</span>{" "}
            delete the folder and all its contents. This action cannot be
            undone. Make sure you no longer need these files.
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
