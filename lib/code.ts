import fs from "fs";
import path from "path";

export const extractCodeFromFilePath = (filePath: string) => {
  const fullPath = path.resolve(process.cwd(), "contents", filePath);
  return fs.readFileSync(fullPath, "utf-8");
};

export const getFilesInDirectory = (directoryPath: string) => {
  const fullPath = path.resolve(process.cwd(), "contents", directoryPath);
  const files = fs.readdirSync(fullPath).map((file) => ({
    name: file,
    path: path.join(directoryPath, file)
  }));

  return files.sort((a, b) => {
    const isAIndex = a.name.startsWith("index");
    const isBIndex = b.name.startsWith("index");

    const isAUnimportant = a.name.includes("type") || a.name.includes("data");
    const isBUnimportant = b.name.includes("type") || b.name.includes("data");

    if (isAIndex) return -1;
    if (isBIndex) return 1;

    if (isAUnimportant && !isBUnimportant) return 1;
    if (!isAUnimportant && isBUnimportant) return -1;

    return 0;
  });
};
