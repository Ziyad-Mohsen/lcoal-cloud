import { readdir, stat, rm } from "node:fs/promises";
import type { NextFunction, Request, Response } from "express";
import path from "node:path";
import { MAX_TOTAL_SIZE, STORAGE_ROOT } from "../../config/server.ts";
import type {
  ApiResponse,
  FilesCount,
  FileStats,
  StorageInfo,
} from "../../../types/index.ts";
import getFolderSize from "get-folder-size";
import mime from "mime-types";
import { readdirSync, statSync } from "node:fs";

export const filesCount = async (
  _req: Request,
  res: Response<ApiResponse<FilesCount>>,
  next: NextFunction
) => {
  try {
    const recursiveCount = (dir: string) => {
      const result = {
        total: 0,
        videos: 0,
        audio: 0,
        images: 0,
        text: 0,
        others: 0,
      };

      const entries = readdirSync(dir);

      for (const entry of entries) {
        const entryPath = path.join(dir, entry);

        const stats = statSync(entryPath);

        if (stats.isDirectory()) {
          const nestedResult = recursiveCount(entryPath);
          for (const key of Object.keys(result) as (keyof FilesCount)[]) {
            result[key] += nestedResult[key];
          }
        } else if (stats.isFile()) {
          const fileExt = path.extname(entry);
          const mimeType = mime.lookup(fileExt);
          switch (mimeType.toString().split("/")[0]) {
            case "image":
              result.images++;
              break;
            case "video":
              result.videos++;
              break;
            case "audio":
              result.audio++;
              break;
            case "text":
              result.text++;
              break;
            default:
              result.others++;
          }
          result.total++;
        }
      }

      return result;
    };
    const filesCount = recursiveCount(STORAGE_ROOT);
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Files count was calculated successfully",
      data: filesCount,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

export const listFiles = async (
  req: Request,
  res: Response<ApiResponse<FileStats[]>>,
  next: NextFunction
) => {
  try {
    const relativePath = (req.query.path as string) || "/";
    const fullPath = path.resolve(STORAGE_ROOT, "." + relativePath);

    // TODO: extract to middleware
    if (!fullPath.startsWith(STORAGE_ROOT)) {
      return res.status(403).json({
        success: false,
        status: 403,
        message: "You don't have access to this path",
        data: null,
        errors: null,
      });
    }

    const fileNames = await readdir(fullPath, {
      recursive: false,
    });

    const files: FileStats[] = await Promise.all(
      fileNames.map(async (name) => {
        const filePath = path.join(fullPath, name);
        const stats = await stat(filePath);
        const extension = stats.isFile() ? name.split(".").at(-1) : null;
        const mimeType = mime.lookup(extension || "") || null;

        return {
          name,
          size: stats.size,
          extension,
          mimeType,
          isFile: stats.isFile(),
          createdAt: stats.birthtime.toString(),
        };
      })
    );
    const sortedFiles = files.sort((a, b) => {
      if (a.isFile && !b.isFile) {
        return 1;
      }
      if (!a.isFile && b.isFile) {
        return -1;
      }
      return 0;
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: "Files are retrieved successfully",
      data: sortedFiles,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

export const downloadFile = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    const relativePath = (req.query.path as string) || "/";
    const fullPath = path.resolve(STORAGE_ROOT, "." + relativePath);

    if (!fullPath.startsWith(STORAGE_ROOT)) {
      return res.status(403).json({
        success: false,
        status: 403,
        message: "You don't have access to this path",
        data: null,
        errors: null,
      });
    }

    const fileStat = await stat(fullPath);
    if (!fileStat.isFile()) {
      res.status(422).json({
        success: false,
        status: 422,
        message: "Provided path is not a file",
        data: null,
        errors: null,
      });
    }

    res.download(fullPath);
  } catch (error) {
    next(error);
  }
};

export const deleteFile = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    const relativePath = (req.query.path as string) || "";
    if (!relativePath)
      res.status(400).json({
        success: false,
        status: 400,
        message: "Invalid file path",
        data: null,
        errors: null,
      });
    const fullPath = path.resolve(STORAGE_ROOT, "." + relativePath);

    if (!fullPath.startsWith(STORAGE_ROOT)) {
      return res.status(403).json({
        success: false,
        status: 403,
        message: "You don't have access to this path",
        data: null,
        errors: null,
      });
    }

    await rm(fullPath);
    return res.status(200).json({
      success: true,
      status: 200,
      message: "File is deleted successfully",
      data: null,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getStorageSize = async (
  _req: Request,
  res: Response<ApiResponse<StorageInfo>>,
  next: NextFunction
) => {
  try {
    const size = await getFolderSize.strict(STORAGE_ROOT);

    const storageInfo: StorageInfo = {
      maxSize: MAX_TOTAL_SIZE,
      size,
      percentage: (size / MAX_TOTAL_SIZE) * 100,
    };

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Storage info is retrieved successfully",
      data: storageInfo,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadFile = (
  req: Request,
  res: Response<ApiResponse<{ path: string; size: number }>>,
  next: NextFunction
) => {
  try {
    const file = (req as Request & { file?: { path: string; size: number } })
      .file;

    if (!file) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "No file uploaded",
        data: null,
        errors: null,
      });
    }

    const relativePath = path.join("/", path.relative(STORAGE_ROOT, file.path));

    return res.status(201).json({
      success: true,
      status: 201,
      message: "File uploaded successfully",
      data: {
        path: relativePath,
        size: file.size,
      },
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};
