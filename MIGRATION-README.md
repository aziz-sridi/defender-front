# Image Migration: VPS to Cloudflare R2

This guide helps you migrate images from your VPS to Cloudflare R2 storage and update your database records accordingly.

## 🎯 Overview

Your current setup stores images on VPS (`https://api.defendr.gg/`) which aren't accessible when running locally. This migration will:

1. **Download** images from VPS
2. **Upload** them to Cloudflare R2
3. **Update** database records with new URLs
4. **Maintain** backward compatibility

## 📋 Prerequisites

- Node.js 18+ installed
- Cloudflare R2 bucket created
- MongoDB database access
- VPS images accessible

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file and update with your values:

```bash
cp migration-env-example.txt .env.migration
```

Edit `.env.migration` with your actual values:

```env
# Cloudflare R2 Configuration
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
CLOUDFLARE_ACCESS_KEY_ID=your_access_key_id_here
CLOUDFLARE_SECRET_ACCESS_KEY=your_secret_access_key_here
CLOUDFLARE_BUCKET_NAME=your_bucket_name_here
CLOUDFLARE_PUBLIC_URL=https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev

# Database Configuration
DATABASE_URL=mongodb://your_mongodb_connection_string_here

# VPS Configuration
VPS_BASE_URL=https://api.defendr.gg
```

### 3. Test Migration Setup

```bash
npm run test-migration
```

This will verify:

- ✅ Environment configuration
- ✅ VPS connectivity
- ✅ Cloudflare R2 access
- ✅ Database connection
- ✅ Sample upload test

### 4. Run Migration

```bash
npm run migrate-images
```

## 📊 What Gets Migrated

The script migrates images from these collections:

| Collection      | Image Field    | Type               |
| --------------- | -------------- | ------------------ |
| `users`         | `profileImage` | User avatars       |
| `teams`         | `logo`         | Team logos         |
| `tournaments`   | `coverImage`   | Tournament covers  |
| `organizations` | `logo`         | Organization logos |

## 🔄 Migration Process

### Phase 1: Discovery

- Scans database for documents with image fields
- Identifies images that need migration
- Skips already migrated images (Cloudflare URLs)

### Phase 2: Download

- Downloads images from VPS
- Handles retries for failed downloads
- Validates image integrity

### Phase 3: Upload

- Uploads to Cloudflare R2 with organized structure:
  ```
  migrated/
  ├── user/
  ├── team/
  ├── tournament/
  └── organization/
  ```
- Sets appropriate cache headers
- Generates unique filenames

### Phase 4: Update

- Updates database records with new URLs
- Adds `imageMigratedAt` timestamp
- Maintains original data integrity

## 📁 File Structure

```
migrated/
├── user/
│   ├── 1703123456789-abc12345.jpg
│   └── 1703123456790-def67890.png
├── team/
│   ├── 1703123456791-ghi11111.jpg
│   └── 1703123456792-jkl22222.png
├── tournament/
│   └── 1703123456793-mno33333.jpg
└── organization/
    └── 1703123456794-pqr44444.jpg
```

## 🛡️ Safety Features

### Backup Strategy

- **No data loss**: Original URLs preserved during migration
- **Rollback capability**: Migration log tracks all changes
- **Batch processing**: Processes in small batches to avoid overwhelming systems

### Error Handling

- **Retry logic**: Automatic retries for failed operations
- **Graceful failures**: Continues processing even if some images fail
- **Detailed logging**: Comprehensive logs for troubleshooting

### Validation

- **URL validation**: Checks for valid image URLs
- **File integrity**: Validates downloaded images
- **Database consistency**: Ensures atomic updates

## 📈 Monitoring & Logs

### Progress Tracking

```
🔄 Starting image migration...
📁 Processing users collection...
   Found 150 documents with images
   Progress: 10/150
   Progress: 20/150
   ...
```

### Migration Summary

```
📊 Migration Summary:
   Total images processed: 150
   Successfully migrated: 145
   Skipped: 3
   Failed: 2
```

### Log Files

Migration logs are saved as `migration-log-[timestamp].json` containing:

- Migration statistics
- Individual migration records
- Error details
- Configuration used

## 🔧 Configuration Options

### Environment Variables

| Variable                   | Description                | Default |
| -------------------------- | -------------------------- | ------- |
| `MIGRATION_BATCH_SIZE`     | Images per batch           | 10      |
| `MIGRATION_RETRY_ATTEMPTS` | Retry attempts             | 3       |
| `MIGRATION_RETRY_DELAY`    | Delay between retries (ms) | 1000    |

### Customization

You can modify the migration script to:

- Change batch sizes
- Add custom image processing
- Implement different retry strategies
- Add additional validation

## 🚨 Troubleshooting

### Common Issues

#### 1. Environment Variables Missing

```
❌ Missing required environment variables: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_ACCESS_KEY_ID
```

**Solution**: Check your `.env.migration` file

#### 2. VPS Connectivity Failed

```
❌ VPS connectivity failed: ECONNREFUSED
```

**Solution**: Verify VPS is running and accessible

#### 3. Cloudflare R2 Access Denied

```
❌ Cloudflare R2 connectivity failed: AccessDenied
```

**Solution**: Check R2 credentials and bucket permissions

#### 4. Database Connection Failed

```
❌ Database connectivity failed: MongoNetworkError
```

**Solution**: Verify MongoDB connection string

### Debug Mode

For detailed debugging, you can modify the script to add more logging:

```javascript
// Add to migration script
console.log('Debug: Processing image:', imageUrl)
console.log('Debug: Generated filename:', newFilename)
```

## 🔄 Rollback Process

If you need to rollback the migration:

1. **Stop the application**
2. **Restore database** from backup
3. **Update image sanitizer** to use VPS URLs
4. **Restart application**

## 📞 Support

If you encounter issues:

1. Check the migration log file
2. Run the test script to identify problems
3. Verify all environment variables
4. Check Cloudflare R2 bucket permissions

## 🎉 Post-Migration

After successful migration:

1. **Update Next.js config** to include Cloudflare domain
2. **Test image loading** in your application
3. **Monitor performance** improvements
4. **Consider removing** old VPS images (after verification)

## 📝 Next Steps

1. **Test locally**: Verify images load correctly
2. **Deploy changes**: Update production environment
3. **Monitor**: Watch for any image loading issues
4. **Cleanup**: Remove old VPS images (optional)

---

**Happy migrating! 🚀**
