# Picture Upload Component Package

This package contains all the necessary files for a complete picture upload component that can be used in any React/Next.js project.

## 📦 Files Included

1. **ImageUploadArea.tsx** - Main upload component
2. **ImageCropModal.tsx** - Image cropping modal
3. **UploadButton.tsx** - Upload button component
4. **imageUploadService.ts** - Upload service (simplified version)
5. **handleFileSelect.ts** - File validation utility
6. **Icons** - UploadIcon and ImageIcon components

## 🔧 Dependencies

You'll need to install these packages:

```bash
npm install react react-image-crop sonner
# or
yarn add react react-image-crop sonner
```

For Next.js projects:

```bash
npm install next react react-image-crop sonner
```

## 📝 Usage Example

```tsx
import ImageUploadArea from './components/ImageUploadArea'

function MyComponent() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  return (
    <ImageUploadArea
      title="Profile Picture"
      dimensions="400x400px"
      isSquare
      enableCrop
      cropAspectRatio={1}
      acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
      maxSize={5}
      existingImage={imageUrl}
      onUploaded={({ url }) => setImageUrl(url)}
    />
  )
}
```

## ⚙️ Configuration

Before using, you need to configure the upload endpoint in `imageUploadService.ts`:

```typescript
const UPLOAD_PATH = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_ENDPOINT || '/upload/image'
```

Or modify the `uploadImage` function to use your own API client.

---
