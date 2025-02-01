# Podvex

<div align="center">
  <br />
    <a href="https://podvex.vercel.app" target="_blank">
      <img src="https://github.com/tmachnacki/portfolio/blob/master/src/assets/podvex/home-dark-wide.webp" alt="Podvex home page">
    </a>
  <br />

  <div>
    <img src="https://img.shields.io/badge/-Typescript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Next_._JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextjs" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-Stripe-black?style=for-the-badge&logoColor=white&logo=stripe&color=412991" alt="stripe" />
  </div>

  <h3 align="center">A Podcast Streaming Platform</h3>
</div>

## 📋 <a name="table">Table of Contents</a>

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Run Locally](#run-locally)


## <a name="overview">Overview</a>

A podcast streaming platform featuring light and dark modes, responsive design, subscription payments, real-time database updates, audio playback controls, multi-voice AI text-to-speech generation, and more.

All images via unsplash.

## <a name="tech-stack">Tech Stack</a>

- TypeScript
- React
- Next.js
- Tailwind CSS
- shadcn/ui
- Convex
- Clerk
- Stripe
- Unreal Speech AI

## <a name="features">Features</a>

☑ **Robust Authentication**: Secure authentication with Google OAuth and email OTP using Clerk.

☑ **Account Management**: Manage your account information with Clerk.

☑ **Home Page**: Showcases trending podcasts, recent podcasts, top creators, and more.

☑ **Podcast Player**: Features backward/forward controls, as well as mute/unmute functionality.

☑ **Create Podcast Page**: File uploads and text-to-speech audio generation with form validation.

☑ **Multi Voice AI Functionality**: Generate audio with 5 voice presets from Unreal Speech AI.

☑ **Discover Page**: Find new podcasts with search functionality.

☑ **History Page**: View your recently played podcasts.

☑ **Library Page**: View your saved podcasts.

☑ **Podcast Details Page**: View podcast information, including creator details, number of plays, and transcript. Edit, delete, or get a link to share.

☑ **Profile Page**: View a creator's number of listeners, number of plays, and podcasts.

☑ **Get Verified Page**: Choose a subscription plan to get a verified badge.

☑ **Subscription Payments**: Manage billing information and create checkout sessions with Stripe's API integrations.

☑ **Light and dark modes**: Switch between light, dark, and system themes.

☑ **Responsive design**: A seamless experience on all devices.


## <a name="run-locally">Run Locally</a>

Follow these steps to set up the project locally on your machine.

**Clone/Download the Repository**

```bash
git clone https://github.com/tmachnacki/podvex.git
cd podvex
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env.local` in the root of your project and add the following content:

```env
# hosted url
NEXT_PUBLIC_URL=https://podvex.vercel.app/

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
NEXT_CLERK_ISSUER=https://<your_clerk_slug>.clerk.accounts.dev
NEXT_PUBLIC_CLERK_SIGN_IN_URL='/sign-in'
NEXT_PUBLIC_CLERK_SIGN_UP_URL='/sign-up'
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL="/"
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL="/"

CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Deployment used by `npx convex dev`
CONVEX_DEPLOYMENT=dev:<your_convex_slug> 
NEXT_PUBLIC_CONVEX_URL=https://<your_convex_slug>.convex.cloud

UNREALSPEECH_API_KEY=

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Stripe forwarding
# ./stripe listen --forward-to https://<your_convex_slug>.convex.site/stripe
```

Replace the placeholder and empty values with your actual credentials. 

**Convex & Clerk**

Sign up on the [Convex](https://www.convex.dev/) and [Clerk](https://clerk.com/) websites.
Follow [Convex's Guide](https://docs.convex.dev/auth/clerk) on getting started with clerk. You will need to update `next.config.mjs` with your Convex url. Create a Clerk webhook endpoint to sync clerk and convex. Register endpoint `https://<your_convex_slug>.convex.site/clerk` and subscribe to `user.created`, `user.deleted`, and `user.updated` events. Copy and paste the Clerk signing secret into `CLERK_WEBHOOK_SECRET`.

**Stripe**

Register for a test account at [Stripe](https://www.stripe.com) and update `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY`. Create your pricing plans on Stipe and update `./lib/stripe-plans.ts` with your plans' details. Add a webhook endpoint with `https://<your_convex_slug>.convex.site/stripe`. Subscribe to `checkout.session.completed`, `customer.subscription.deleted`, and `invoice.paid` events. Copy and paste the signing secret into `STRIPE_WEBHOOK_SECRET`.

**Unreal**

Register at [Unreal Speech](https://unrealspeech.com/) and obtain your api key.


**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.


#
