const imagekit = {
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ''
};

export const uploadImageToImageKit = async (file: File, folder: string = ''): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('publicKey', process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '');
    formData.append('signature', '');
    formData.append('expire', '0');
    formData.append('token', '');
    formData.append('fileName', `${Date.now()}-${file.name}`);
    if (folder) formData.append('folder', folder);

    const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa((process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY || '') + ':')}`,
      },
      body: formData
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Upload failed');
    
    return data.url;
  } catch (error) {
    console.error('ImageKit upload error:', error);
    throw error;
  }
};

export default imagekit;
