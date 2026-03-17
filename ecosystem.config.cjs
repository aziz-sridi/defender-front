// DEPRECATED: Use ecosystem.config.dev.cjs or ecosystem.config.prod.cjs instead
// This file is kept for backwards compatibility only

module.exports = {
  apps: [
    {
      name: 'DEFENDR-FRONTEND-NEW',
      script: 'npm',
      args: 'run start',
      cwd: '/home/defendr/DEV/FRONT',
      env: {
        NODE_ENV: 'production',
        PORT: 4100,

        NEXTAUTH_URL: 'https://dev.defendr.gg',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'REPLACE_WITH_SECURE_SECRET_IN_PRODUCTION',

        // Optional: Add Google OAuth credentials if Google login is needed
        // GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        // GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      },
      post_update: ['npm install', 'npm run build'],
    },
  ],
}
