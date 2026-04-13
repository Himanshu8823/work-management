# Demo Credentials

For testing purposes only. Do not use in production.

## Admin Account

- **Email**: admin@company.com
- **Password**: Admin@123456

**Note**: These credentials must be seeded from the backend using `npm run seed` command in the backend directory. The backend is responsible for creating and managing user credentials.

## How to Use

1. Start the backend server: `cd ../client-work-backend && npm run dev`
2. Run the seed command if needed: `npm run seed`
3. Start the frontend: `npm run dev`
4. Use the credentials above to login at http://localhost:5173/login

## Security

- Never commit real credentials to version control
- These demo credentials are only for local development
- For production, use a secure credential management system
