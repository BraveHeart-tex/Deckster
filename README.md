# **Deckster: Agile Scrum Poker Estimation Made Simple**

**Deckster** is a real-time, modern, web-based tool designed to facilitate agile sprint planning through collaborative Scrum Poker estimation. Built with remote teams in mind, it streamlines story point estimation, fosters engagement, and promotes accurate planning in a fun and effective way.

---
## ❓ Why Deckster?

Deckster was born out of a real-world need.
At work, our team relied on a popular Scrum Poker tool—but key features like custom decks, advanced collaboration options, and integrations were locked behind a paywall.
Rather than continue with a restricted tool, I decided to build a free and open alternative that gives full control to teams—no feature gating, no subscriptions.

It was also the perfect opportunity to experiment with Convex, a cutting-edge backend platform that promises reactive, serverless data without the traditional boilerplate. Deckster became both a solution to a pain point and a playground for exploring powerful new tooling.

---

## **📚 Table of Contents**

* [Overview](#overview)
* [Features](#features)
* [Getting Started](#getting-started)
* [Technology Stack](#technology-stack)

---

## **🧭 Overview**

Deckster helps agile teams run virtual Scrum Poker sessions to estimate user stories collaboratively. Whether you're co-located or distributed, Deckster offers a fluid, interactive experience to align team understanding and reduce planning friction.

---

## **✨ Features**

* 🔢 **Interactive Scrum Poker** – Run real-time, virtual planning poker sessions.
* 📊 **Story Point Estimation** – Vote and track estimates collaboratively.
* 💬 **Live Team Collaboration** – Discuss tasks and reach consensus instantly.
* 🔐 **Authentication & Authorization** – Secure user access with role management.
* ⚙️ **Customizable Configurations** – Tailor session settings to fit your workflow.

---

## **🚀 Getting Started**

Follow these steps to set up and run **Deckster** locally:

---

### 1. **Configure Environment Variables**

Create a `.env.local` file in the project root and add the following values:

```dotenv
# Used by `pnpm dlx convex dev`
CONVEX_DEPLOYMENT=your-convex-deployment-id

# Convex public URL for client access
NEXT_PUBLIC_CONVEX_URL=https://your-convex-instance.convex.cloud

# Clerk credentials
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
CLERK_FRONTEND_API_URL=https://api.clerk.dev

# Clerk redirect URLs (customize to your routes)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# For secure webhook handling
CLERK_WEBHOOK_SECRET=your-clerk-webhook-secret
```

---

### 2. **Clone the Repository**

```bash
git clone https://github.com/BraveHeart-tex/Deckster.git
cd Deckster
```

---

### 3. **Install Dependencies**

Using [pnpm](https://pnpm.io/) for efficient package management:

```bash
pnpm install
```

---

### 4. **Start the App**

```bash
pnpm run dev
```

---

### 5. **Start the Convex Development Server**

```bash
pnpm dlx convex dev
```

---

### 6. **Open the App**

Visit: [http://localhost:3000](http://localhost:3000)

Your local Deckster instance should now be running.

---

## **🧱 Technology Stack**

* **Frontend:** [Next.js](https://nextjs.org/), [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
* **Backend:** [Convex](https://convex.dev/), [Node.js](https://nodejs.org/)
* **Authentication:** [Clerk](https://clerk.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)