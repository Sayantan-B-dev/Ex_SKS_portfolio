# Rebranding Documentation: SKS → Sammrat Ka Saagar

## Overview
This document tracks the rebranding from "SKS" (Sammrat Ka Saagar) abbreviation to the full brand name "Sammrat Ka Saagar" across the codebase. The change was made to emphasize the full brand identity while keeping "Samrat Sarkar" as the artist name unchanged.

## Changes Made

### 1. Core Layout & Metadata (`app/layout.tsx`)
- **Site Name**: `SKS : Samrat Sarkar Music Band` → `Sammrat Ka Saagar : Samrat Sarkar Music Band`
- **Page Title Template**: `%s | Samrat Sarkar : SKS Music Band` → `%s | Samrat Sarkar : Sammrat Ka Saagar Music Band`
- **Default Title**: `SKS | Samrat Sarkar : Bollywood Playback Singer & Live Band` → `Sammrat Ka Saagar | Samrat Sarkar : Bollywood Playback Singer & Live Band`
- **Description**: Removed `(SKS)` parenthetical from brand mention
- **Keywords**: Replaced "SKS music band", "SKS band" with "Sammrat Ka Saagar music band", "Sammrat Ka Saagar band"
- **OpenGraph/Twitter**: Updated siteName and titles
- **JSON-LD Structured Data**:
  - MusicGroup: `name: "Sammrat Ka Saagar"`, removed "SKS" from alternateName
  - WebSite: Updated alternateName
  - Organization: `name: "Sammrat Ka Saagar"`, removed "SKS" from alternateName
  - Kept logo references to `/images/sks_logo_png.webp` (to be updated when new logo is ready)

### 2. Landing Page (`app/page.tsx`)
- **Title**: Updated to use "Sammrat Ka Saagar"
- **Description**: Removed `(SKS)` parenthetical
- **Keywords**: Replaced "SKS band" with "Sammrat Ka Saagar band"
- **OpenGraph**: Updated siteName and title
- **Twitter**: Updated title

### 3. About Page (`app/about/page.tsx`)
- **OpenGraph**: Updated siteName and title
- **Twitter**: Updated title
- **Image Alt Text**: "SKS Music Band founder" → "Sammrat Ka Saagar Music Band founder"

### 4. Shows Page (`app/shows/page.tsx`)
- **OpenGraph**: Updated siteName and title
- **Twitter**: Updated title
- **JSON-LD EventSeries**: Updated name, performer, organizer to "Sammrat Ka Saagar"
- **Image Alt Text**: "SKS Music Band performing" → "Sammrat Ka Saagar Music Band performing"

### 5. Gallery Page (`app/gallery/page.tsx`)
- **Image Alt Text**: "SKS Music Band photo and stage gallery" → "Sammrat Ka Saagar Music Band photo and stage gallery"

### 6. Gallery Layout (`app/gallery/layout.tsx`)
- **Keywords**: "SKS band gallery", "SKS band live photos" → "Sammrat Ka Saagar band gallery", "Sammrat Ka Saagar band live photos"
- **OpenGraph**: Updated siteName, title, image alt
- **Twitter**: Updated title

### 7. Blog Listing (`app/blog/page.tsx`)
- **Description**: "SKS live band" → "Sammrat Ka Saagar live band"
- **Keywords**: "SKS band stories", "SKS music band blog" → "Sammrat Ka Saagar band stories", "Sammrat Ka Saagar music band blog"
- **OpenGraph**: Updated siteName, title, description
- **Twitter**: Updated title, description
- **UI Text**: "THE SKS BLOG" → "THE SAMMRAT KA SAAGAR BLOG"

### 8. Blog Post (`app/blog/[slug]/page.tsx`)
- **OpenGraph**: Updated siteName, title
- **Twitter**: Updated title

### 9. Components

#### Header (`components/Header.tsx`)
- **Logo Image**: Commented out the `<Image>` component for `/images/sks_logo_png.webp` (temporarily hidden)
- **Logo Text**: Already had "SAMMRAT KA SAAGAR" and "MUSIC BAND" - kept as-is
- **Removed unused `Image` import**

#### Footer (`components/Footer.tsx`)
- **Logo Image**: Commented out the `<Image>` component for `/images/sks_logo_png.webp` (temporarily hidden)
- **Logo Text**: Already had "SAMMRAT KA SAAGAR" and "MUSIC BAND" - kept as-is
- **Copyright**: Already used "Sammrat Ka Saagar Music Band" - kept as-is
- **Removed unused `Image` import**

#### Loading Screen (`app/loading.tsx`)
- **Loading Logo Text**: "SKS" → "SAMMRAT KA SAAGAR"

### 10. FAQ Content (`lib/faqs.ts`)
- **Question 1**: "What kind of events can SKS perform at?" → "What kind of events can Sammrat Ka Saagar perform at?"
- **Answer 2**: "SKS can be booked..." → "Sammrat Ka Saagar can be booked..."
- **Answer 6**: "The SKS team will come back..." → "The Sammrat Ka Saagar team will come back..."

### 11. PWA Manifest (`public/manifest.json`)
- **Name**: "SKS Samrat Sarkar Music Band" → "Sammrat Ka Saagar Samrat Sarkar Music Band"
- **Short Name**: "SKS Band" → "Sammrat Ka Saagar"
- **Icons**: Kept reference to `/images/sks_logo_png.webp` (to be updated when new logo is ready)

### 12. Humans.txt (`public/humans.txt`)
- **Header**: "# SKS Music Band — Samrat Sarkar" → "# Sammrat Ka Saagar Music Band — Samrat Sarkar"

### 13. Design Documentation (`DESIGN.md`)
- **Header**: "Design tokens and component patterns for the SKS site" → "Design tokens and component patterns for the Sammrat Ka Saagar site"

## Items NOT Changed (Intentional)

### Infrastructure/Technical References
The following technical paths and identifiers were **NOT** changed as they are internal infrastructure references, not user-facing branding:
- ImageKit folder paths: `/sks-portfolio/blogs` (in `lib/imagekit.ts`, `scripts/setup-imagekit-folders.mjs`, dashboard panels)
- MongoDB client cache variable: `__sksMongoClient` (in `lib/blog.ts`)
- ImageKit folder creation cache: `__sksImageKitFolders` (in `lib/imagekit.ts`)
- Blog auth cookie name: `sks-blog-session` (in `lib/blog-auth.ts`)
- Package name: `sks-music-band` (in `package.json`)
- Environment variable references in AGENTS.md and comments

These are internal technical identifiers and changing them would risk breaking infrastructure without user-facing benefit.

### Logo Files
- Logo image files (`/images/sks_logo_png.webp`) remain in place
- Logo references in metadata (icons, JSON-LD) still point to the existing file
- The Image components in Header and Footer are **commented out** (not deleted) for easy restoration when new logo is ready
- CSS classes for logos (`.sks-official-logo`, `.footer-sks-logo`, `.logo .sks`, etc.) remain in stylesheets

## Future Work
When the new "Sammrat Ka Saagar" logo is ready:
1. Replace `/images/sks_logo_png.webp` with new logo file
2. Uncomment the `<Image>` components in `Header.tsx` and `Footer.tsx`
3. Update alt text to "Sammrat Ka Saagar Official Logo"
4. Update manifest.json icon reference if filename changes
5. Update JSON-LD logo references in `app/layout.tsx`

## Verification
Run the following to verify changes:
```bash
npm run lint
npx tsc --noEmit
npm run dev
```

Then visually verify at http://localhost:3000 that:
- No "SKS" appears in user-facing text (except possibly in commented code)
- "Sammrat Ka Saagar" appears prominently in headers, footers, metadata
- "Samrat Sarkar" remains unchanged throughout
- Logo images are hidden (commented out)