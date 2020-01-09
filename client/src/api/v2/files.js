import { useState, useEffect, useCallback } from 'react';

export async function getFiles() {
  const response = await fetch('/files');
  const data = await response.json();
  const files = data.files.map((fileName) => ({
    fileName,
    url: `/files/${fileName}`,
  }));
  return files;
}

export async function deleteFile(file) {
  await fetch(file.url, { method: 'DELETE' });
}

export function useFiles() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setFiles(await getFiles());
    }
    fetchData();
  }, []);

  const deleteFileHandler = useCallback(async (file) => {
    await deleteFile(file);
    setFiles(await getFiles());
  }, []);

  return [files, deleteFileHandler];
}
