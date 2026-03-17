require('dotenv').config({ path: '/home/defendr/DEV/FRONT/.env.development' })

module.exports = {
  apps: [
    {
      name: 'defendr-frontend-development',
      script: 'node',

      args: './node_modules/next/dist/bin/next start',
      env: {
        NODE_ENV: 'development',
        PORT: process.env.PORT || 4100,
        NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API,
        NEXT_PUBLIC_API_DEV: process.env.NEXT_PUBLIC_API_DEV,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      },
      post_update: ['npm install', 'npm run build'],
    },
  ],
}
