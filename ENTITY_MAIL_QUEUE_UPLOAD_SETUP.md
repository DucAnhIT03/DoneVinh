# Required Dependencies for Entity + Mail + Queue + Upload

## Install these packages:

```bash
npm install @nestjs/bull bull @nestjs/config nodemailer multer uuid
npm install @types/nodemailer @types/multer @types/uuid --save-dev
```

## Environment Variables (.env)

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@busticket.com

# Redis Configuration (for Queue)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
CLOUD_PROVIDER=local

# AWS Configuration (if using AWS S3)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Application Configuration
BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001
```

## Database Migration for User Avatar

```sql
-- Add avatar column to users table
ALTER TABLE users ADD COLUMN avatar VARCHAR(255) NULL;
```




