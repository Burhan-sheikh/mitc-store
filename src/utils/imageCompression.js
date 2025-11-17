// FILE PURPOSE:
// - Compress images to maximum 700KB for Firestore storage
// - Convert images to Base64 format
// - Validate image size before upload
// - Provides compression options and quality settings

import imageCompression from 'browser-image-compression';

// Maximum file size in KB (700KB as per requirements)
const MAX_FILE_SIZE_KB = 700;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_KB * 1024;

/**
 * Compress image file to maximum 700KB
 * @param {File} file - Image file to compress
 * @returns {Promise<File>} Compressed image file
 */
export const compressImage = async (file) => {
  const options = {
    maxSizeMB: MAX_FILE_SIZE_KB / 1024, // Convert KB to MB
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/jpeg', // Convert to JPEG for better compression
    initialQuality: 0.8,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    
    // If still too large, compress more aggressively
    if (compressedFile.size > MAX_FILE_SIZE_BYTES) {
      const aggressiveOptions = {
        ...options,
        maxWidthOrHeight: 1280,
        initialQuality: 0.6,
      };
      return await imageCompression(compressedFile, aggressiveOptions);
    }
    
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw new Error('Failed to compress image');
  }
};

/**
 * Convert image file to Base64 string
 * @param {File} file - Image file to convert
 * @returns {Promise<string>} Base64 string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Compress and convert image to Base64
 * @param {File} file - Image file to process
 * @returns {Promise<string>} Compressed Base64 string
 */
export const compressAndConvertToBase64 = async (file) => {
  try {
    const compressedFile = await compressImage(file);
    const base64String = await fileToBase64(compressedFile);
    
    // Validate final size
    const sizeInBytes = (base64String.length * 3) / 4;
    if (sizeInBytes > MAX_FILE_SIZE_BYTES) {
      throw new Error(`Image size (${Math.round(sizeInBytes / 1024)}KB) exceeds maximum allowed size (${MAX_FILE_SIZE_KB}KB)`);
    }
    
    return base64String;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};

/**
 * Validate image file size
 * @param {File} file - Image file to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const validateImageSize = (file) => {
  return file.size <= MAX_FILE_SIZE_BYTES;
};

/**
 * Get human-readable file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Process multiple images and compress them
 * @param {FileList|File[]} files - Array of image files
 * @param {number} maxImages - Maximum number of images allowed
 * @returns {Promise<string[]>} Array of Base64 strings
 */
export const processMultipleImages = async (files, maxImages = 5) => {
  const fileArray = Array.from(files).slice(0, maxImages);
  const base64Promises = fileArray.map(file => compressAndConvertToBase64(file));
  return Promise.all(base64Promises);
};

export default {
  compressImage,
  fileToBase64,
  compressAndConvertToBase64,
  validateImageSize,
  formatFileSize,
  processMultipleImages,
  MAX_FILE_SIZE_KB,
};