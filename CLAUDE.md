# Claude Code Context - Portfolio Project

## Project Overview

Modern professional portfolio built with React, Tailwind CSS v4, Firebase, and serverless functions.

### Key Technologies
- **Frontend**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Firebase Firestore + Auth
- **State Management**: Zustand (i18n)
- **Animations**: Framer Motion
- **Deployment**: Netlify (with serverless functions)

## Architecture

### Frontend Components

**UI Components** (`src/components/ui/`)
- `Button.tsx` - Primary, ghost, outline variants
- `Badge.tsx` - Category and tech tags
- `Spinner.tsx` - Loading states
- `Modal.tsx` - Dialogs and lightbox

**Layout** (`src/components/layout/`)
- `Header.tsx` - Navigation with i18n toggle
- `Footer.tsx` - Social links
- `ProtectedRoute.tsx` - Auth wrapper
- `AdminLayout.tsx` - Admin panel wrapper

**Projects** (`src/components/projects/`)
- `ProjectCard.tsx` - Individual project card with hover
- `ProjectGrid.tsx` - Grid with stagger animation
- `ProjectHero.tsx` - Hero section for detail page
- `ImageGallery.tsx` - Lightbox gallery
- `CategoryFilter.tsx` - Filter buttons
- `TechBadge.tsx` - Tech stack badges

**Admin** (`src/components/admin/`)
- `ProjectForm.tsx` - Bilingual form for create/edit
- `ImageUploader.tsx` - Drag & drop with FTP upload
- `ProjectTable.tsx` - (optional) Projects list table

### Hooks

- `useAuth.ts` - Firebase authentication
- `useProjects.ts` - Firestore CRUD operations
- `useTranslation.ts` - i18n with Zustand

### Styling Notes

- HeroUI/NextUI components with project CSS in `src/index.css`
- Dark mode as default (no light mode toggle needed)
- Design tokens in `src/index.css`
- Fixed width utilities (`section`, `container`)
- No Tailwind directives in component CSS files

## Data Structure

### Firestore Collections

**projects** collection
- Bilingual fields: title, description, content (challenge/solution/result)
- Arrays: images (FTP URLs), techs
- Enum: category (web/system/dashboard/mobile)
- Metadata: featured, createdAt, updatedAt

## Development Workflow

### Environment Setup
```bash
npm install
cp .env.example .env.local
# Fill in Firebase credentials and FTP config
npm run dev
```

### Build & Deploy
```bash
npm run build           # Production build
netlify deploy --prod   # Deploy to Netlify
```

## Important Implementation Details

### Image Upload Flow
1. Admin uploads file in `ImageUploader` component
2. File sent to `netlify/functions/upload-ftp.ts`
3. Function connects to FTP and uploads
4. Returns public URL
5. URL stored in Firestore project doc

### Bilingual Support
- All text content duplicated for PT/EN
- Language stored in Zustand store (persisted to localStorage)
- `useTranslation` hook provides `t()` function

### Authentication
- Firebase Auth (email/password)
- Protected routes via `ProtectedRoute` component
- Admin panel at `/admin` (requires auth)

## Known Limitations & TODOs

- [ ] Image optimization (consider next/image approach)
- [ ] SEO meta tags (use react-helmet)
- [ ] Sitemap generation
- [ ] Analytics integration
- [ ] Blog functionality
- [ ] Code splitting (chunk size warnings)
- [ ] Testing suite
- [ ] Accessibility improvements

## File Organization

Critical files to modify:
- `src/App.tsx` - Main router
- `src/index.css` - Design tokens and global styles
- `src/i18n/*.ts` - Translations
- `netlify/functions/upload-ftp.ts` - FTP configuration

Optional enhancements:
- Add ESLint config
- Add Prettier for formatting
- Add unit tests (Vitest)
- Add E2E tests (Playwright)

## Performance Considerations

- Lazy image loading (native img tag)
- Code splitting via React.lazy (optional)
- Firebase indexing for efficient queries
- Chunk size warnings (need code splitting)

## Deployment Checklist

Before going live:
- [ ] Set up Firebase security rules
- [ ] Configure FTP credentials in Netlify
- [ ] Test image upload flow
- [ ] Verify both languages work
- [ ] Test auth flow
- [ ] Performance audit
- [ ] Mobile testing
- [ ] Accessibility check

## Notes for Future Development

- Icon imports from lucide-react don't support all names (used Code instead of Github)
- Tailwind CSS v4 has stricter CSS validation (avoid @apply in base layers)
- TypeScript path aliases configured (`@/` = `src/`)
- Firebase project needs security rules configured correctly
