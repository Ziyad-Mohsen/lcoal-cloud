import { Folder, FolderPlus, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  Dialog,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Field, FieldError } from "@/components/ui/field";
import { createFolder } from "@/api/folders.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useStoragePath } from "@/hooks/useStoragePath";
import { joinPath } from "@/lib/utils";
import { QUERY_KEYS, type QueryKeyType } from "@/lib/queryClient";

export function CreateFolderDialog() {
  const path = useStoragePath();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [folderName, setFolderName] = useState<string>("");
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createFolder,
    onSuccess: () => {
      setOpen(false);
      toast.success(`Created "${folderName}" folder`);
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

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createMutation.mutate({ path: path.pathname, folderName });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setFolderName("");
        setOpen(open);
        createMutation.reset();
      }}
    >
      <div>
        <DialogTrigger asChild>
          <Button variant="outline">
            Create Folder <FolderPlus />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Folder</DialogTitle>
            <DialogDescription>
              New folder will be created in:{" "}
              <span className="py-1 px-2 bg-secondary rounded-lg">
                {joinPath([path.root, ...path.segments, folderName])}
              </span>
            </DialogDescription>
          </DialogHeader>
          <form ref={formRef} onSubmit={handleFormSubmit}>
            <Field>
              <InputGroup>
                <InputGroupAddon>
                  <Folder />
                </InputGroupAddon>
                <InputGroupInput
                  value={folderName}
                  placeholder="Folder Name"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFolderName(e.target.value)
                  }
                />
                <InputGroupAddon align="inline-end">
                  {folderName && (
                    <X
                      className="cursor-pointer"
                      onClick={() => {
                        setFolderName("");
                      }}
                    />
                  )}
                </InputGroupAddon>
              </InputGroup>
              {createMutation.error && (
                <FieldError className="flex items-center gap-1">
                  <Info size={18} />
                  {createMutation.error.message}
                </FieldError>
              )}
            </Field>
          </form>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              disabled={createMutation.isPending}
              type="submit"
              onClick={() => {
                formRef.current?.requestSubmit();
              }}
            >
              {createMutation.isPending ? (
                <>
                  Creating <Spinner />
                </>
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </div>
    </Dialog>
  );
}
