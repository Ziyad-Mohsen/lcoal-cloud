export type ApiResponse<T = null, E = null> = {
  success: boolean;
  status: number;
  message: string;
  data: T | null;
  errors: E[] | null;
};

export type FileStats = {
  name: string;
  size: number;
  extension?: string | null;
  mimeType?: string | null;
  isFile: boolean;
  createdAt: string;
};

export type FilesCount = {
  total: number;
  videos: number;
  audio: number;
  images: number;
  text: number;
  others: number;
};

export type StorageInfo = {
  maxSize: number;
  size: number;
  percentage: number;
};
