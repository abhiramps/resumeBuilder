# Port Configuration Guide

## Port Assignment

| Service  | Port | URL                      |
|----------|------|--------------------------|
| Frontend | 3000 | http://localhost:3000    |
| Backend  | 3001 | http://localhost:3001    |

## Configuration Files

### Frontend Configuration

**`.env`**
```env
VITE_API_URL=http://localhost:3001
```

**`vite.config.ts`**
```typescript
export default defineConfig({
  server: {
    port: 3000,  // Frontend runs on port 3000
    proxy: {
      '/api': {
        target: 'http://localhost:3001',  // Proxy to backend on port 3001
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

**`src/config/api.config.ts`**
```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  // ...
};
```

### Backend Configuration

**`.env`**
```env
PORT=3001
FRONTEND_URL=http://localhost:3000
```

**`serverless.yml`**
```yaml
custom:
  serverless-offline:
    httpPort: ${self:provider.environment.PORT}  # Uses PORT from .env (3001)
    noPrependStageInUrl: true
```

## Starting the Application

### Option 1: Separate Terminals

**Terminal 1 - Backend:**
```bash
cd resumeBuilderBackend
npm run dev
# Backend starts on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd resumeBuilderFrontend
npm run dev
# Frontend starts on http://localhost:3000
```

### Option 2: Using Concurrently (Future Enhancement)

You can add a root `package.json` with:
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd resumeBuilderBackend && npm run dev",
    "dev:frontend": "cd resumeBuilderFrontend && npm run dev"
  }
}
```

## API Request Flow

1. **Frontend makes request**: `http://localhost:3000/api/resumes`
2. **Vite proxy intercepts**: Matches `/api` pattern
3. **Proxy forwards to backend**: `http://localhost:3001/api/resumes`
4. **Backend processes**: Returns response
5. **Frontend receives**: Response data

## CORS Configuration

Since we're using Vite's proxy in development, CORS is handled automatically. The backend sees requests as coming from `localhost:3001` (same origin).

For production, you'll need to configure CORS in the backend to allow requests from your production frontend URL.

## Troubleshooting

### Port Already in Use

**Frontend (Port 3000):**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)
```

**Backend (Port 3001):**
```bash
# Find process using port 3001
lsof -ti:3001

# Kill the process
kill -9 $(lsof -ti:3001)
```

### Connection Refused

1. Verify backend is running on port 3001
2. Check `.env` files have correct port configuration
3. Ensure no firewall blocking localhost connections

### Proxy Not Working

1. Restart Vite dev server after changing `vite.config.ts`
2. Clear browser cache
3. Check browser console for CORS errors
4. Verify proxy configuration in `vite.config.ts`

## Production Considerations

In production:
- Frontend will be served from a CDN or static hosting
- Backend will have its own domain/URL
- Update `VITE_API_URL` environment variable to production backend URL
- Configure CORS on backend to allow production frontend domain
- Remove proxy configuration (only needed for development)

## Environment Variables Summary

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend (`.env`)
```env
PORT=3001
FRONTEND_URL=http://localhost:3000
DATABASE_URL=your_database_url
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
# ... other backend env vars
```
