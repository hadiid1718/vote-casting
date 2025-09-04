const { v2: cloudinary} = require("cloudinary")
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

// Check if Cloudinary is properly configured
const isCloudinaryConfigured = () => {
  return process.env.CLOUDINARY_CLOUD_NAME && 
         process.env.CLOUDINARY_API_KEY && 
         process.env.CLOUDINARY_API_SECRET;
};

// Upload file to Cloudinary
const uploadToCloudinary = async (file, folder = 'uploads') => {
  try {
    console.log('uploadToCloudinary called with:', { fileName: file.name, fileSize: file.size, folder });
    console.log('Cloudinary config check:', {
      cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
      api_key: !!process.env.CLOUDINARY_API_KEY,
      api_secret: !!process.env.CLOUDINARY_API_SECRET
    });
    
    // Check if Cloudinary is configured
    if (!isCloudinaryConfigured()) {
      console.warn('Cloudinary not configured, using local storage fallback');
      
      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(__dirname, '../uploads', folder);
      console.log('Creating uploads directory:', uploadsDir);
      
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log('Uploads directory created');
      }
      
      const fileName = `${uuid()}_${file.name}`;
      const filePath = path.join(uploadsDir, fileName);
      console.log('Moving file to:', filePath);
      
      // Move file to uploads directory
      await file.mv(filePath);
      console.log('File moved successfully');
      
      // Return a mock cloudinary response
      const result = {
        secure_url: `/uploads/${folder}/${fileName}`,
        public_id: `uploads/${folder}/${fileName}`,
        resource_type: 'image'
      };
      console.log('Local storage result:', result);
      return result;
    }
    
    console.log('Using Cloudinary upload');
    // Create a temporary file path
    const tempDir = path.join(__dirname, '../temp');
    console.log('Temp directory:', tempDir);
    
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
      console.log('Temp directory created');
    }
    
    const tempFileName = `${uuid()}_${file.name}`;
    const tempFilePath = path.join(tempDir, tempFileName);
    console.log('Temp file path:', tempFilePath);
    
    // Move file to temp location
    console.log('Moving file to temp location...');
    await file.mv(tempFilePath);
    console.log('File moved to temp location successfully');
    
    // Upload to cloudinary
    console.log('Uploading to Cloudinary...');
    try {
      const result = await cloudinary.uploader.upload(tempFilePath, {
        folder: folder,
        resource_type: 'auto'
      });
      console.log('Cloudinary upload successful:', result.secure_url);
      
      // Clean up temp file
      console.log('Cleaning up temp file...');
      fs.unlinkSync(tempFilePath);
      console.log('Temp file cleaned up');
      
      return result;
    } catch (cloudinaryError) {
      console.error('Cloudinary upload failed, falling back to local storage:', cloudinaryError.message);
      
      // Clean up temp file
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      
      // Fall back to local storage
      const uploadsDir = path.join(__dirname, '../uploads', folder);
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      const fileName = `${uuid()}_${file.name}`;
      const filePath = path.join(uploadsDir, fileName);
      
      // Move file to uploads directory
      await file.mv(filePath);
      
      // Return a local storage response
      return {
        secure_url: `/uploads/${folder}/${fileName}`,
        public_id: `uploads/${folder}/${fileName}`,
        resource_type: 'image'
      };
    }
  } catch (error) {
    console.error('Upload error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    throw new Error('Failed to upload file: ' + error.message);
  }
};

// Delete file from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    // Check if Cloudinary is configured
    if (!isCloudinaryConfigured()) {
      console.warn('Cloudinary not configured, attempting local file deletion');
      
      // For local storage, the publicId is the relative path
      const filePath = path.join(__dirname, '..', publicId);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return { result: 'ok' };
      } else {
        console.warn(`Local file not found: ${filePath}`);
        return { result: 'not found' };
      }
    }
    
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error('Failed to delete file');
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary
};
