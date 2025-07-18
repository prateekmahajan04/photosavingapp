# PhotoShare - Modern Photo Sharing Web App

A beautiful, production-ready photo sharing application built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🔐 **Secure Authentication** - Email/password authentication with Supabase
- 📸 **Photo Upload** - Upload images with titles and descriptions
- 🖼️ **Personal Gallery** - View your uploaded photos in a beautiful grid layout
- 🗄️ **Cloud Storage** - Images stored securely in Supabase Storage
- 📱 **Responsive Design** - Works perfectly on all devices
- 🔒 **Row Level Security** - Users can only see their own photos
- 🐳 **Docker Support** - Containerized for easy deployment
- ☸️ **Kubernetes Ready** - Complete K8s deployment configuration

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Authentication, Storage)
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Deployment**: Docker, Kubernetes, Nginx

## Quick Start

### Prerequisites

- Node.js 18+
- Supabase account

### 1. Clone and Install

```bash
git clone <repository-url>
cd photoshare
npm install
```

### 2. Environment Setup

1. Copy `.env.example` to `.env`
2. Update with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_STORAGE_BUCKET=photos
```

### 3. Database Setup

Run the SQL migration in your Supabase SQL editor:

```sql
-- Copy contents from supabase/migrations/create_photos_table.sql
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

## Production Deployment

### Docker Deployment

```bash
# Build image
docker build -t photoshare:latest .

# Run container
docker run -p 3000:80 photoshare:latest
```

### Kubernetes Deployment

1. Update configuration files in `k8s/` folder
2. Deploy to cluster:

```bash
cd k8s
chmod +x deploy.sh
./deploy.sh
```

## Project Structure

```
src/
├── components/          # React components
│   ├── AuthModal.tsx   # Authentication modal
│   ├── Header.tsx      # App header
│   ├── PhotoGrid.tsx   # Photo gallery grid
│   └── PhotoUpload.tsx # Photo upload modal
├── hooks/              # Custom React hooks
│   └── useAuth.ts      # Authentication hook
├── lib/                # Utilities
│   └── supabase.ts     # Supabase client
├── App.tsx             # Main app component
└── main.tsx           # App entry point

k8s/                    # Kubernetes manifests
├── namespace.yaml      # Namespace definition
├── configmap.yaml      # Configuration
├── secret.yaml         # Secrets
├── persistent-volume.yaml # Storage
├── deployment.yaml     # App deployment
├── service.yaml        # Service definition
├── ingress.yaml        # Ingress configuration
└── hpa.yaml           # Horizontal Pod Autoscaler
```

## Key Features

### Authentication
- Email/password signup and login
- Secure session management
- Protected routes

### Photo Management
- Upload images with metadata
- View personal photo gallery
- Delete unwanted photos
- Responsive image display

### Storage
- Images stored in Supabase Storage
- Secure file uploads
- Automatic URL generation

### Security
- Row Level Security (RLS)
- User isolation
- Secure file access

## Configuration

### Supabase Setup

1. Create a new Supabase project
2. Run the migration SQL
3. Configure storage bucket
4. Update environment variables

### Storage Configuration

The app uses Supabase Storage with:
- Bucket name: `photos`
- Public access enabled
- User-specific folder structure

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details