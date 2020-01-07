import { useState, useEffect } from 'react';

export async function getFiles() {
  const response = await fetch('/files');
  const data = await response.json();
  return data.files;
}

export async function deleteFile(fileName) {
  await fetch(`/files/${fileName}`, { method: 'DELETE' });
}

export function useFiles() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setFiles(await getFiles());
    }
    fetchData();
  }, []);

  async function deleteFileHandler(fileName) {
    await deleteFile(fileName);
    setFiles(await getFiles());
  }

  return [files, deleteFileHandler];
}
