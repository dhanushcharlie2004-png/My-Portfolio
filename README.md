# Dhanush S - Developer Portfolio

A responsive, high-performance, and visually stunning single-page developer portfolio website built for **Dhanush S**. Showcase your credentials as a Computer Science Graduate and your skills as a Java & Full-Stack Developer.

## Features

- **Rich Aesthetics**: Premium Dark Mode by default with sleek Light Mode toggle, neon accents, and clean CSS layouts.
- **Micro-interactions**: Subtle hover state transitions on project cards, skill badges, and social media buttons.
- **Scroll Utilities**: Dynamic scrolling page progress bar and scroll-sensitive active link highlights in the header navigation.
- **Contact Form Validation**: Full client-side input validation and error feedback with success status Toast alerts.
- **SEO & Accessibility Optimized**: Built using semantic HTML5 elements, descriptive meta titles, viewport configs, SVG icons, and accessible aria-labels.

## Project Structure

```text
dhanush-portfolio/
├── index.html     # Semantic structure, sections, SEO meta tags, and SVG assets
├── style.css      # Custom HSL-color tokens, typography, layouts, and animations
├── script.js     # Light/Dark mode toggler, navigation tracker, and form validation
└── README.md      # Project overview and setup instructions
```

## Running Locally

Because this project is built using vanilla web technologies (HTML, CSS, and JS), you don't need any complex frameworks to run it. You have two options:

### Option 1: Direct File Open
Simply double-click the `index.html` file in your file explorer to open and run the portfolio directly in any modern web browser.

### Option 2: Live Local Server
If you prefer running a dev environment (with automatic page refreshes), you can use any light static server.

1. **Using Node.js (`npx`):**
   ```bash
   npx serve .
   ```
   *Or:*
   ```bash
   npx live-server
   ```
2. **Using Python:**
   ```bash
   python -m http.server 8000
   ```
   Open `http://localhost:8000` in your browser.

## Deployment Steps

This site is fully static and ready to host for free on various services:

### 1. GitHub Pages (Recommended)
1. Initialize a Git repository in this folder:
   ```bash
   git init
   git add .
   git commit -m "Initialize portfolio website"
   ```
2. Create a new repository on GitHub.
3. Link and push your code:
   ```bash
   git remote add origin https://github.com/dhanush-s/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```
4. On GitHub, go to your repository's **Settings > Pages**. Under **Build and deployment**, select the `main` branch and `/ (root)` folder, then click **Save**. Your site will be live at `https://dhanush-s.github.io/your-repo-name/`.

### 2. Vercel
1. Install Vercel CLI or link your repository to your Vercel Dashboard.
2. Run the deployment command in the project root:
   ```bash
   vercel
   ```
3. Follow the CLI prompts. Your site will be deployed instantly.
