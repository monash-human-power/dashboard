import { useState, useEffect, useCallback } from 'react';

export interface LogFile {
  /** Log file name */
  fileName: string;
  /** URL to download file */
  url: string;
}

/**
 * Get list of log files
 *
 * @returns List of log files
 */
export async function getFiles() {
  const response = await fetch('/files');
  const data = await response.json();
  const files: LogFile[] = data.files.map((fileName: string) => ({
    fileName,
    url: `/files/${fileName}`,
  }));
  return files;
}

/**
 * Delete a log file
 *
 * @param file Log file
 */
export async function deleteFile(file: LogFile) {
  await fetch(file.url, { method: 'DELETE' });
}

/**
 * Use a list of log files
 *
 * @returns List of log files, and function to delete a log file
 */
export function useFiles() {
  const [files, setFiles] = useState<LogFile[]>([]);

  useEffect(() => {
    /** Fetch file data */
    async function fetchData() {
      setFiles(await getFiles());
    }
    fetchData();
  }, []);

  const deleteFileHandler = useCallback(async (file: LogFile) => {
    await deleteFile(file);
    setFiles(await getFiles());
  }, []);

  return { files, deleteFile: deleteFileHandler };
}

/**
 * Use the latest file URL
 *
 * @returns Log file location
 */
export function useLatestFile() {
  return '/files/recent';
}
