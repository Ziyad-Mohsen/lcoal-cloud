import { Link } from "react-router-dom";
import type { FileStats } from "../../../../backend/types";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { formatFileSize, formatRelativeDate } from "@/lib/utils";
import { getFileConfig } from "@/lib/fileTypeConfig";
import { Download, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiBaseUrl } from "@/lib/axios";
import FileDropDownMenu from "../files/FileDropDownMenu";
import FolderDropDownMenu from "@/components/folders/FolderDropDownMenu";
import type { MouseEvent } from "react";
import { useStoragePath } from "@/hooks/useStoragePath";

export default function FilesTableView({ files }: { files: FileStats[] }) {
  const path = useStoragePath();
  return (
    <Table className="rounded-lg overflow-hidden">
      <TableHeader className="bg-secondary text-secondary-foreground">
        <TableRow>
          <TableHead className="flex-1">Name</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Created_at</TableHead>
          <TableHead></TableHead>
          {/* <TableHead className="text-right">Amount</TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {!path.isRoot && (
          <TableRow>
            <TableCell colSpan={4} className="py-0">
              <Link
                to=".."
                relative="path"
                className="block w-full h-full py-4"
              >
                ../
              </Link>
            </TableCell>
          </TableRow>
        )}
        {files.map((file, i) => {
          const fileConfig = getFileConfig({
            extension: file.extension,
            mimeType: file.mimeType,
          });
          const Icon = fileConfig.icon;
          const filePath = path.join(file.name);
          return (
            <TableRow key={i}>
              <TableCell
                colSpan={file.isFile ? 1 : 4}
                className="font-medium py-0"
              >
                {file.isFile ? (
                  <div className="flex gap-2 items-end py-4">
                    <Icon strokeWidth={1} style={{ color: fileConfig.color }} />
                    <span>{file.name}</span>
                  </div>
                ) : (
                  <Link
                    to={file.name}
                    className="flex gap-2 items-end w-full h-full py-4"
                  >
                    <Folder strokeWidth={1} />
                    <span>{file.name}</span>
                    <div
                      className="ml-auto"
                      onClick={(e: MouseEvent<HTMLDivElement>) => {
                        e.stopPropagation();
                      }}
                    >
                      <FolderDropDownMenu folder={file} />
                    </div>
                  </Link>
                )}
              </TableCell>
              {file.isFile && (
                <>
                  <TableCell>{formatFileSize(file.size)}</TableCell>
                  <TableCell>
                    {formatRelativeDate(Date.parse(file.createdAt))}
                  </TableCell>
                  <TableCell align="right" className="space-x-2">
                    <Button size="icon-sm" variant="outline" asChild>
                      <Link
                        to={`${apiBaseUrl}/files/download?path=${filePath}`}
                      >
                        <Download />
                      </Link>
                    </Button>
                    <FileDropDownMenu file={file} />
                  </TableCell>
                </>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
