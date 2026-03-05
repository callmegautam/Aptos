# Contributing Guide

This guide explains how to contribute to the project safely and consistently.

Follow these instructions carefully so the repository history stays clean and the development workflow remains predictable.

---

# 1. Prerequisites

Make sure you have the following installed.

### Node.js

Recommended version:

```
Node 18+ or Node 20 LTS
```

Check installation:

```bash
node -v
```

---

### pnpm

This project uses **pnpm** as the package manager.

Check if pnpm is installed:

```bash
pnpm -v
```

If not installed:

```bash
npm install -g pnpm
```

---

### Git

Check installation:

```bash
git --version
```

---

# 2. Fork the Repository

You should **never work directly on the main repository**.

Instead, create your own copy.

1. Open the repository on GitHub
2. Click **Fork**

This creates a copy under your GitHub account.

Example:

```
original-repo-owner/project-name
```

becomes

```
your-username/project-name
```

---

# 3. Clone Your Fork

Clone your fork to your machine.

```bash
git clone https://github.com/YOUR_USERNAME/project-name.git
```

Move into the project folder.

```bash
cd project-name
```

---

# 4. Install Dependencies

Install project dependencies using pnpm.

```bash
pnpm install
```

---

# 5. Environment Variables

Copy the example environment file.

```bash
cp .env.example .env
```

Update the values in `.env` if required.

---

# 6. Run the Development Server

Start the Next.js development server.

```bash
pnpm dev
```

Open:

```
http://localhost:3000
```

---

# 7. Format Script

This project uses **Prettier** for formatting.

To format the entire project:

```bash
pnpm format
```

Always format the project **before committing code**.

---

# 8. Build the Project

Before pushing your changes, make sure the project builds successfully.

```bash
pnpm build
```

If the build fails, fix the issue before creating a pull request.

---

# 9. Project Folder Structure

The project follows a modular structure.

```
src/
│
├── app/                 # Next.js App Router pages
├── features/            # Feature-based business modules
├── components/          # Shared UI components
├── lib/                 # Infrastructure layer (DB, auth, AI, etc.)
├── hooks/               # Global reusable hooks
├── types/               # Global TypeScript types
├── utils/               # Helper functions
├── config/              # Project configuration
└── styles/              # Global styles
```

---

## App Router

Inside `app` we organize routes using **route groups**.

Example:

```
(marketing)
(auth)
(dashboard)
```

These group related pages without affecting URLs.

---

## Features Folder

Business logic lives inside `features`.

Example:

```
features/
 ├── auth
 ├── interview
 ├── candidate
 ├── coding
 ├── ai
 └── report
```

Each feature contains its own:

```
components
service
types
actions
```

This keeps the code modular and scalable.

---

# 10. Branching Strategy

This project uses two important branches.

```
main → production
dev  → development
```

### Important rule

All contributions **must go to the `dev` branch**.

Never create a pull request to `main`.

---

# 11. Feature Branch Workflow

Every new change must be done inside a **feature branch**.

A feature branch is a temporary branch created from `dev` where you implement one specific change.

Examples:

```
feature/login-page
feature/interview-room-ui
fix/candidate-profile-error
```

Why feature branches exist:

- prevents developers from breaking the `dev` branch
- keeps work isolated
- makes reviewing changes easier
- avoids conflicts between developers

---

### Create a Feature Branch

First switch to dev:

```bash
git checkout dev
```

Pull the latest changes:

```bash
git pull --rebase origin dev
```

Then create your feature branch:

```bash
git checkout -b feature/feature-name
```

Example:

```bash
git checkout -b feature/login-page
```

Now implement your feature.

---

# 12. Commit Rules

Clean commits make the repository understandable.

Follow these rules carefully.

---

## One Feature Per Commit

Each commit should represent **one logical change**.

Good example:

```
feat: add login form UI
```

Bad example:

```
fix login + navbar + dashboard layout
```

Mixing multiple changes makes reviews difficult.

---

## Avoid Very Small Commits

Do not commit every tiny change.

Bad history:

```
fix typo
fix button
fix padding
fix margin
```

Instead, group related work into **one meaningful commit**.

---

## Commit Message Style

Use clear commit messages.

Example:

```
feat: implement interview room layout
fix: resolve candidate profile API error
refactor: simplify auth service logic
```

---

# 13. Formatting Before Commit

Before committing your code:

```bash
pnpm format
```

This ensures consistent code formatting across the project.

---

# 14. Push Your Feature Branch

After committing your changes, push your branch.

```bash
git push origin feature/feature-name
```

Example:

```bash
git push origin feature/login-page
```

---

# 15. Create a Pull Request

Go to GitHub and create a **Pull Request**.

Important:

```
Base branch: dev
```

Not:

```
main
```

Your PR will then be reviewed by maintainers.

---

# 16. Avoid Merge Commits

Merge commits create messy commit history.

Bad history example:

```
Merge branch 'dev'
Merge branch 'main'
```

This happens when developers use:

```
git pull
```

without rebasing.

---

## Always Use Rebase When Updating

Before continuing work on your branch, update dev using:

```bash
git pull --rebase origin dev
```

This keeps the commit history **linear and clean**.

---

# 17. Updating Your Pull Request

If maintainers request changes:

Make the fixes locally and commit again.

Example:

```bash
git add .
git commit -m "fix: improve login validation"
```

Push again:

```bash
git push origin feature/login-page
```

The pull request will update automatically.

---

# 18. Daily Contribution Workflow

Typical developer workflow:

1. Pull latest dev

```
git checkout dev
git pull --rebase origin dev
```

2. Create feature branch

```
git checkout -b feature/my-feature
```

3. Work on feature

4. Format code

```
pnpm format
```

5. Commit changes

```
git commit -m "feat: implement feature"
```

6. Push branch

```
git push origin feature/my-feature
```

7. Create Pull Request to `dev`

---

# 19. Final Checklist Before PR

Before creating a pull request, ensure:

• Project runs locally
• Code formatted with `pnpm format`
• Project builds successfully

Run:

```bash
pnpm build
```

---

# Final Note

Good contributions are not just about writing code.

They also include:

• clean commits
• understandable changes
• consistent formatting
• respecting the development workflow

A well-maintained repository scales smoothly as more developers join the project.
