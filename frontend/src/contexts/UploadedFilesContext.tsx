import { axiosInstance } from "@/lib/axios";
import queryClient, { QUERY_KEYS } from "@/lib/queryClient";
import React, { createContext, useContext, useState } from "react";

type UploadState = "waiting..." | "in progress" | "completed" | "failed";

type GetUploadStateColorFunction = (state: UploadState) => { hexCode: string };

type UploadFileFunction = (params: {
  pathname: string;
  onDone: () => void;
  onAbort: () => void;
}) => void;

type AbortFileUploadFunction = (fileId: string) => void;

export type FileWithProgress = {
  id: string;
  file: File;
  state: UploadState;
  progress: number;
  uploaded: boolean;
  controller?: AbortController;
};

export type UploadedFile = FileWithProgress & { isNew?: boolean };

type UploadedFilesContextType = {
  uploadedFiles: UploadedFile[];
  selectedFiles: FileWithProgress[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<FileWithProgress[]>>;
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  getUploadStateColor: GetUploadStateColorFunction;
  uploadFiles: UploadFileFunction;
  abortFileUpload: AbortFileUploadFunction;
} | null;

const UploadedFilesContext = createContext<UploadedFilesContextType>(null);

export default function UploadedFilesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedFiles, setSelectedFiles] = useState<FileWithProgress[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const uploadStateColors: Record<UploadState, string> = {
    "waiting...": "#9CA3AF", // gray
    "in progress": "#3B82F6", // blue
    completed: "#10B981", // green
    failed: "#EF4444", // red
  };

  const getUploadStateColor: GetUploadStateColorFunction = (state) => {
    return { hexCode: uploadStateColors[state] };
  };

  const uploadFiles: UploadFileFunction = async ({
    pathname,
    onAbort,
    onDone,
  }) => {
    if (selectedFiles.length === 0) {
      return;
    }

    const uploadPromises = selectedFiles.map(async (selectedFile) => {
      const formData = new FormData();
      formData.append("file", selectedFile.file);

      try {
        setUploadedFiles((prevFiles) =>
          Array.from(new Set([{ ...selectedFile, isNew: true }, ...prevFiles])),
        );

        await axiosInstance.post(`/files/upload?path=${pathname}`, formData, {
          signal: selectedFile.controller?.signal,
          onUploadProgress: (ProgressEvent) => {
            const progress =
              Math.round(ProgressEvent.loaded * 100) /
              (ProgressEvent.total || 1);

            setUploadedFiles((prevFiles) => {
              return prevFiles.map((file) =>
                file.id === selectedFile.id
                  ? { ...file, state: "in progress", progress }
                  : file,
              );
            });
          },
        });

        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FILES] });
        setUploadedFiles((prevFiles) =>
          prevFiles.map((file) =>
            file.id === selectedFile.id
              ? { ...file, state: "completed", uploaded: true }
              : file,
          ),
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
          onAbort();
        } else {
          console.error(error);
          setUploadedFiles((prevFiles) =>
            prevFiles.map((file) =>
              file.id === selectedFile.id
                ? { ...file, state: "failed", uploaded: false }
                : file,
            ),
          );
        }
      }
    });

    onDone();
    setSelectedFiles([]);
    await Promise.all(uploadPromises);
  };

  const abortFileUpload: AbortFileUploadFunction = (fileId) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((file) => {
        if (file.id === fileId) {
          file.controller?.abort();
          return false;
        } else {
          return true;
        }
      }),
    );
  };

  return (
    <UploadedFilesContext.Provider
      value={{
        selectedFiles,
        uploadedFiles,
        setSelectedFiles,
        setUploadedFiles,
        getUploadStateColor,
        uploadFiles,
        abortFileUpload,
      }}
    >
      {children}
    </UploadedFilesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUploadedFiles = () => {
  const context = useContext(UploadedFilesContext);
  if (context === null) {
    throw new Error(
      "useUploadedFiles must be used within UploadedFilesProvider",
    );
  }
  return context;
};
