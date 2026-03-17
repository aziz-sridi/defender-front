require('dotenv').config({ path: '/home/defendr/PROD/FRONT/.env.local' })

module.exports = {
  apps: [
    {
      name: 'defendr-frontend-production',
      script: 'npm',
      args: 'start',
      cwd: '/home/defendr/PROD/FRONT',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API,
        NEXT_PUBLIC_API_PROD: process.env.NEXT_PUBLIC_API_PROD,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      },
      post_update: ['npm install', 'npm run build'],
    },
  ],
}
