# Blog Featured Image Upload - Integration Guide

## Current Status ✅
- Server is running on port 3000
- Database connection is working
- Cloudinary is configured and connected
- Local storage fallback is working
- Blog creation endpoint is functional

## Frontend Integration Requirements

### 1. Blog Creation with Featured Image

**Endpoint:** `POST /api/blogs`
**Headers:** 
```
Authorization: Bearer <your-jwt-token>
Content-Type: multipart/form-data
```

**Form Data Fields:**
```javascript
const formData = new FormData();
formData.append('title', 'Your blog title');
formData.append('content', 'Your blog content');
formData.append('tags', 'tag1,tag2,tag3');
formData.append('featuredImage', fileObject); // This is the key field name
formData.append('isWinnerAnnouncement', 'false'); // optional
formData.append('relatedElection', 'election-id'); // optional
```

### 2. Image Upload Only (for blog content)

**Endpoint:** `POST /api/blogs/upload-images`
**Form Data:**
```javascript
const formData = new FormData();
formData.append('images', fileObject1);
formData.append('images', fileObject2); // multiple images
```

### 3. Common Issues & Solutions

#### Issue 1: "featuredImage not uploading"
**Solution:** Ensure you're using the exact field name `featuredImage` in your form data.

#### Issue 2: File size limit
**Solution:** Keep images under 2MB (2000000 bytes).

#### Issue 3: File format
**Solution:** Use standard image formats (jpg, jpeg, png, gif).

#### Issue 4: Authorization errors
**Solution:** Include valid JWT token in Authorization header.

### 4. JavaScript Example
```javascript
// Create blog with featured image
async function createBlogWithImage(title, content, imageFile, token) {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('content', content);
  formData.append('featuredImage', imageFile);
  
  try {
    const response = await fetch('http://localhost:3000/api/blogs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    const result = await response.json();
    console.log('Blog created:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### 5. Response Format
```json
{
  "_id": "blog-id",
  "title": "Blog Title",
  "content": "Blog Content",
  "featuredImage": {
    "url": "/uploads/blog_featured/filename.jpg",
    "publicId": "uploads/blog_featured/filename.jpg"
  },
  "author": { ... },
  "createdAt": "2025-01-04T18:06:40.000Z"
}
```
