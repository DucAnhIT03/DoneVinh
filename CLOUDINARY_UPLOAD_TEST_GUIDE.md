# 🖼️ Cloudinary Upload API Test Guide

## 🚀 **Setup Postman**

### 1. Import Collection
1. Mở Postman
2. Click **Import**
3. Chọn file `Cloudinary_Upload_API_Collection.json`
4. Click **Import**

### 2. Set Environment Variables
Tạo environment mới với các biến:
- `baseUrl`: `http://localhost:3000`
- `jwt_token`: `your-jwt-token-here`
- `public_id`: `sample-public-id` (sẽ được cập nhật sau khi upload)

## 📊 **Test Sequence**

### **Phase 1: Test Upload Single Image**

#### 1.1. Test Upload Single Image
```
POST {{baseUrl}}/upload/single
Authorization: Bearer {{jwt_token}}
Content-Type: multipart/form-data

Body (form-data):
- image: [Select image file]
- folder: "bus-booking/test"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "public_id": "bus-booking/test/sample-image",
    "secure_url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/bus-booking/test/sample-image.jpg",
    "url": "http://res.cloudinary.com/your-cloud/image/upload/v1234567890/bus-booking/test/sample-image.jpg",
    "width": 1920,
    "height": 1080,
    "format": "jpg",
    "bytes": 245760,
    "created_at": "2024-01-15T00:00:00Z"
  }
}
```

#### 1.2. Test Upload Single Image (No Folder)
```
POST {{baseUrl}}/upload/single
Authorization: Bearer {{jwt_token}}
Content-Type: multipart/form-data

Body (form-data):
- image: [Select image file]
```

### **Phase 2: Test Upload Multiple Images**

#### 2.1. Test Upload Multiple Images
```
POST {{baseUrl}}/upload/multiple
Authorization: Bearer {{jwt_token}}
Content-Type: multipart/form-data

Body (form-data):
- images: [Select multiple image files]
- folder: "bus-booking/gallery"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "3 images uploaded successfully",
  "data": [
    {
      "public_id": "bus-booking/gallery/image1",
      "secure_url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/bus-booking/gallery/image1.jpg",
      "width": 1920,
      "height": 1080,
      "format": "jpg",
      "bytes": 245760,
      "created_at": "2024-01-15T00:00:00Z"
    },
    {
      "public_id": "bus-booking/gallery/image2",
      "secure_url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/bus-booking/gallery/image2.jpg",
      "width": 1920,
      "height": 1080,
      "format": "jpg",
      "bytes": 245760,
      "created_at": "2024-01-15T00:00:00Z"
    }
  ]
}
```

### **Phase 3: Test Image Information**

#### 3.1. Test Get Image Info
```
POST {{baseUrl}}/upload/info
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
  "publicId": "bus-booking/test/sample-image"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Image information retrieved successfully",
  "data": {
    "public_id": "bus-booking/test/sample-image",
    "secure_url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/bus-booking/test/sample-image.jpg",
    "width": 1920,
    "height": 1080,
    "format": "jpg",
    "bytes": 245760,
    "created_at": "2024-01-15T00:00:00Z",
    "tags": []
  }
}
```

### **Phase 4: Test Image Transformation**

#### 4.1. Test Transform Image URL
```
POST {{baseUrl}}/upload/transform
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
  "publicId": "bus-booking/test/sample-image",
  "transformations": {
    "width": 500,
    "height": 300,
    "crop": "fill",
    "quality": "auto",
    "format": "webp"
  }
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Image URL transformed successfully",
  "data": {
    "public_id": "bus-booking/test/sample-image",
    "transformed_url": "https://res.cloudinary.com/your-cloud/image/upload/w_500,h_300,c_fill,q_auto,f_webp/bus-booking/test/sample-image.jpg",
    "transformations": {
      "width": 500,
      "height": 300,
      "crop": "fill",
      "quality": "auto",
      "format": "webp"
    }
  }
}
```

#### 4.2. Test Generate Image URL
```
POST {{baseUrl}}/upload/generate-url
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
  "publicId": "bus-booking/test/sample-image",
  "width": 800,
  "height": 600,
  "crop": "fit",
  "quality": "high",
  "format": "jpg"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Image URL generated successfully",
  "data": {
    "public_id": "bus-booking/test/sample-image",
    "image_url": "https://res.cloudinary.com/your-cloud/image/upload/w_800,h_600,c_fit,q_high,f_jpg/bus-booking/test/sample-image.jpg",
    "options": {
      "width": 800,
      "height": 600,
      "crop": "fit",
      "quality": "high",
      "format": "jpg"
    }
  }
}
```

### **Phase 5: Test Remove Images**

#### 5.1. Test Remove Single Image
```
DELETE {{baseUrl}}/upload/single
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
  "publicId": "bus-booking/test/sample-image"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Image removed successfully",
  "data": {
    "success": true,
    "message": "Image removed successfully",
    "public_id": "bus-booking/test/sample-image"
  }
}
```

#### 5.2. Test Remove Multiple Images
```
DELETE {{baseUrl}}/upload/multiple
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
  "publicIds": [
    "bus-booking/gallery/image1",
    "bus-booking/gallery/image2",
    "bus-booking/gallery/image3"
  ]
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Removed 3 images successfully, 0 failed",
  "data": [
    {
      "success": true,
      "message": "Image removed successfully",
      "public_id": "bus-booking/gallery/image1"
    },
    {
      "success": true,
      "message": "Image removed successfully",
      "public_id": "bus-booking/gallery/image2"
    },
    {
      "success": true,
      "message": "Image removed successfully",
      "public_id": "bus-booking/gallery/image3"
    }
  ]
}
```

## 🔧 **Test Cases**

### **Test Case 1: File Validation**
1. ✅ Upload valid image files (JPEG, PNG, GIF, WebP)
2. ❌ Upload invalid file types (PDF, TXT, etc.)
3. ❌ Upload files larger than 5MB
4. ❌ Upload without file

### **Test Case 2: Authentication**
1. ✅ Upload with valid JWT token
2. ❌ Upload without JWT token
3. ❌ Upload with invalid JWT token

### **Test Case 3: Error Handling**
1. ✅ Remove non-existent image
2. ✅ Get info for non-existent image
3. ✅ Transform non-existent image

### **Test Case 4: Performance**
1. ✅ Upload large number of images
2. ✅ Transform multiple images
3. ✅ Remove multiple images

## 🐛 **Troubleshooting**

### **Lỗi 401 - Unauthorized**
- Kiểm tra JWT token
- Đảm bảo token chưa hết hạn
- Kiểm tra format: `Bearer <token>`

### **Lỗi 400 - Bad Request**
- Kiểm tra file type (chỉ JPEG, PNG, GIF, WebP)
- Kiểm tra file size (tối đa 5MB)
- Kiểm tra dữ liệu đầu vào

### **Lỗi 500 - Internal Server Error**
- Kiểm tra Cloudinary configuration
- Kiểm tra network connection
- Kiểm tra logs của ứng dụng

### **Lỗi Cloudinary**
- Kiểm tra API credentials
- Kiểm tra cloud name
- Kiểm tra API key và secret

## 📊 **Expected Results**

### **Successful Upload:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "public_id": "bus-booking/test/sample-image",
    "secure_url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/bus-booking/test/sample-image.jpg",
    "width": 1920,
    "height": 1080,
    "format": "jpg",
    "bytes": 245760,
    "created_at": "2024-01-15T00:00:00Z"
  }
}
```

### **Successful Removal:**
```json
{
  "success": true,
  "message": "Image removed successfully",
  "data": {
    "success": true,
    "message": "Image removed successfully",
    "public_id": "bus-booking/test/sample-image"
  }
}
```

## 🎯 **Success Criteria**

- ✅ Upload single image hoạt động
- ✅ Upload multiple images hoạt động
- ✅ Remove single image hoạt động
- ✅ Remove multiple images hoạt động
- ✅ Get image info hoạt động
- ✅ Transform image URL hoạt động
- ✅ Generate image URL hoạt động
- ✅ File validation hoạt động
- ✅ Error handling hoạt động
- ✅ Authentication hoạt động

## 🚀 **Next Steps**

Sau khi test thành công:
1. **Production Setup**: Cấu hình production Cloudinary
2. **CDN**: Sử dụng Cloudinary CDN cho performance
3. **Monitoring**: Setup logging và monitoring
4. **Security**: Implement rate limiting
5. **Optimization**: Tối ưu hóa image transformations

