import { useState, useEffect, useCallback } from 'react';

/**
 * @typedef {object} LogFile
 * @property {string} fileName  Log file name
 * @property {string} url       URL to download file
 */

/**
 * Get list of log files
 *
 * @returns {Promise<LogFile[]>} List of log files
 */
export async function getFiles() {
  const response = await fetch('/files');
  const data = await response.json();
  const files = data.files.map((fileName) => ({
    fileName,
    url: `/files/${fileName}`,
  }));
  return files;
}

/**
 * Delete a log file
 *
 * @param {LogFile} file Log file
 */
export async function deleteFile(file) {
  await fetch(file.url, { method: 'DELETE' });
}

/**
 * @typedef {object} FilesHook
 * @property {?Array.<LogFile>}   files       List of log files
 * @property {function(LogFile)}  deleteFile  Delete a log file
 */

/**
 * Use a list of log files
 *
 * @returns {FilesHook} Files hook
 */
export function useFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /** Fetch file data */
    async function fetchData() {
      setFiles(await getFiles());
      setLoading(false);
    }
    setLoading(true);
    fetchData();
  }, []);

  const deleteFileHandler = useCallback(async (file) => {
    await deleteFile(file);
    setFiles(await getFiles());
  }, []);

  return { loading, files, deleteFile: deleteFileHandler };
}

/**
 * Use the latest file URL
 *
 * @returns {string} Log file location
 */
export function useLatestFile() {
  return '/files/recent';
}
