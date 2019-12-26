export async function getFiles() {
  const response = await fetch('/files');
  const data = await response.json();
  return data.files;
}

export async function deleteFile(fileName) {
  await fetch(`/files/${fileName}`, { method: 'DELETE' });
}
