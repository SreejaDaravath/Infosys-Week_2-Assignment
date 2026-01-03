# BragBoard - Employee Recognition Wall

An internal employee recognition platform for workplace appreciation. Share shout-outs, celebrate achievements, and build positive workplace culture.

## 🚀 Features

- Employee authentication and profiles
- Create and share shout-outs for colleagues
- React to posts with likes, claps, and stars
- Real-time updates with Supabase
- Modern UI with Tailwind CSS and shadcn/ui components
- Responsive design for desktop and mobile

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 18.0 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`
- **npm** (comes with Node.js) or **bun**
  - Verify npm installation: `npm --version`
  - Or install bun from [bun.sh](https://bun.sh/)
- **Git**
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify installation: `git --version`

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/SreejaDaravath/Infosys-Week_2-Assignment.git
cd Infosys-Week_2-Assignment
```

**Note:** If you've forked this repository, replace the URL with your fork:
```bash
git clone https://github.com/<your-username>/Infosys-Week_2-Assignment.git
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or using bun (faster alternative):
```bash
bun install
```

### 3. Environment Configuration

The project uses Supabase for backend services. The environment variables are already configured in the `.env` file:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anonymous/public key
- `VITE_SUPABASE_PROJECT_ID` - Your Supabase project ID

**⚠️ Security Note:** The `.env` file in this repository contains demo credentials. For production deployments or personal use:
- Create your own Supabase project (see "Setting Up Your Own Supabase Project" section)
- **Never commit real credentials to version control**
- Use environment variables in your deployment platform instead
- Add `.env.local` to `.gitignore` for local development with private credentials

## 🏃‍♂️ Running the Application

### Development Mode

Start the development server with hot-reload:

Using npm:
```bash
npm run dev
```

Or using bun:
```bash
bun run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is already in use).

### Preview Production Build

To preview the production build locally:

1. Build the project:
   
   Using npm:
   ```bash
   npm run build
   ```
   
   Using bun:
   ```bash
   bun run build
   ```

2. Preview the build:
   
   Using npm:
   ```bash
   npm run preview
   ```
   
   Using bun:
   ```bash
   bun run preview
   ```

## 🛠️ Available Scripts

With npm:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

With bun (faster alternative):
- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run build:dev` - Build in development mode
- `bun run lint` - Run ESLint to check code quality
- `bun run preview` - Preview production build locally

## 🏗️ Project Structure

```
├── src/
│   ├── components/       # Reusable UI components (Header, CreateShoutOut, ShoutOutCard, etc.)
│   │   └── ui/          # shadcn/ui component library
│   ├── pages/           # Page components
│   │   ├── Index.tsx    # Main page with shout-outs feed
│   │   ├── Auth.tsx     # Authentication page
│   │   └── NotFound.tsx # 404 page
│   ├── integrations/    # Supabase client and types
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── public/              # Static assets
├── supabase/            # Supabase configuration and migrations
├── index.html           # HTML template
├── package.json         # Project dependencies and scripts
├── vite.config.ts       # Vite configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com/)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables in the Vercel dashboard
6. Click "Deploy"

### Deploy to Netlify

1. Push your code to GitHub
2. Visit [netlify.com](https://netlify.com/)
3. Click "Add new site" → "Import an existing project"
4. Connect to your GitHub repository
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Add environment variables in Netlify settings
8. Click "Deploy"

### Other Platforms

The built application (`dist` folder) is a static site and can be deployed to:
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting
- Cloudflare Pages
- Any static hosting service

## 🔐 Setting Up Your Own Supabase Project

If you want to use your own Supabase backend:

1. Create a free account at [supabase.com](https://supabase.com/)
2. Create a new project
3. Go to Project Settings → API
4. Copy your project URL, anon/public key, and project ID
5. Update the `.env` file with your credentials:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY` - Your anon/public key
   - `VITE_SUPABASE_PROJECT_ID` - Your Supabase project ID
6. Run the migrations from the `supabase/migrations` folder (if any)

## 🐛 Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically try the next available port. Check the terminal output for the actual URL.

### Dependencies Installation Fails

Try clearing the npm cache and reinstalling:
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Build Errors

Ensure you're using Node.js version 18 or higher:
```bash
node --version
```

### Supabase Connection Issues

Verify that:
- The environment variables in `.env` are correct
- Your Supabase project is active
- You have a stable internet connection

## 🤝 Contributing

This is an educational project for Infosys Week 2 Assignment. Feel free to fork and experiment!

## 📝 Technologies Used

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library
- **Supabase** - Backend as a Service (authentication, database, real-time)
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing

## 📄 License

This project is for educational purposes as part of the Infosys Week 2 Assignment.

---

**Need Help?** If you encounter any issues, please check the troubleshooting section or create an issue in the GitHub repository.
