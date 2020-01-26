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
 * Get the contents of a log file
 *
 * @param {LogFile} file Log file
 * @returns {string} CSV content
 */
export async function downloadFile(file) {
  const response = await fetch(file.url);
  const content = await response.text();
  return content;
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

  useEffect(() => {
    /** Fetch file data */
    async function fetchData() {
      setFiles(await getFiles());
    }
    fetchData();
  }, []);

  const deleteFileHandler = useCallback(async (file) => {
    await deleteFile(file);
    setFiles(await getFiles());
  }, []);

  return { files, deleteFile: deleteFileHandler };
}
