import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import dotenv from "dotenv";
import filesRouter from "./modules/files/files.routes.ts";
import foldersRouter from "./modules/folders/folder.routes.ts";
import { errorHandler } from "./middlewares/index.ts";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1/files", filesRouter);
app.use("/api/v1/folder", foldersRouter);

app.get("/api/v1", (_req: Request, res: Response) => {
  res.json({ message: "hello world" });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.join(__dirname, "../../frontend/dist");

app.use(express.static(frontendDistPath));

app.get(/.*/, (_req: Request, res: Response) => {
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

app.use(errorHandler);
const getLocalIpAddress = () => {
  const networkInterfaces = os.networkInterfaces();

  for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];
    for (const iface of interfaces || []) {
      // Check for IPv4, not internal (loopback), and within the 192.168 range
      if (
        iface.family === "IPv4" &&
        !iface.internal &&
        iface.address.startsWith("192.168")
      ) {
        return iface.address;
      }
    }
  }
  return "127.0.0.1 (Local IP not found)";
};

const myIp = getLocalIpAddress();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
console.log(process.env.PORT)

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on:`);
  console.log(`Local: http://localhost:${port}`);
  console.log(`Network: http://${myIp}:${port}`);
});
