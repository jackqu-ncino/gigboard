# GigBoard Deployment Guide

A step-by-step guide to deploy GigBoard from scratch. No coding required — just follow the steps below.

---

## What You'll Need

- A computer with a web browser
- An email address
- About 30-45 minutes

You'll be creating free accounts on three services:

| Service | What it does | Cost |
|---|---|---|
| **Supabase** | Database, user accounts, file storage | Free tier available |
| **Vercel** | Hosts the website | Free tier available |
| **Stripe** | Handles payments (featured gigs, premium profiles) | Free until you process real payments |

---

## Step 1: Set Up Supabase (Database & Auth)

### 1.1 Create an account

1. Go to [supabase.com](https://supabase.com) and click **Start your project**
2. Sign up with your GitHub account (or email)

### 1.2 Create a new project

1. Click **New Project**
2. Fill in:
   - **Name:** GigBoard
   - **Database Password:** Choose a strong password and save it somewhere safe
   - **Region:** Pick the one closest to your users
3. Click **Create new project**
4. Wait 1-2 minutes for it to set up

### 1.3 Run the database setup

You need to run 3 SQL scripts in order. For each one:

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Copy and paste the contents of the file
4. Click **Run**

Run these files **in this exact order:**

| Order | File | What it does |
|---|---|---|
| 1st | `supabase/migrations/001_initial_schema.sql` | Creates all the database tables |
| 2nd | `supabase/migrations/002_seed_data.sql` | Adds instruments and genres |
| 3rd | `supabase/migrations/003_featured_premium.sql` | Adds featured gigs and premium profile support |

**Optional:** To populate the site with demo data (fake users, gigs, musicians), also run:

| Optional | File | What it does |
|---|---|---|
| 4th | `supabase/seed_demo_data.sql` | Adds 20 demo users, 30 gigs, 10 musician profiles |

All demo users have the password: `DemoPass123!`

### 1.4 Copy your Supabase keys

1. Go to **Settings** (gear icon) > **API**
2. You'll need these three values (keep this page open):
   - **Project URL** — looks like `https://abcdefg.supabase.co`
   - **anon / public key** — starts with `eyJ...`
   - **service_role / secret key** — starts with `eyJ...` (click to reveal)

### 1.5 Enable Email Confirmation (recommended)

1. Go to **Authentication** > **Providers** > **Email**
2. Toggle **Confirm email** to **ON**

### 1.6 Set up Google Sign-In (optional)

If you want users to sign in with their Google account:

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (name it "GigBoard")
3. Go to **APIs & Services** > **OAuth consent screen**
   - Choose **External**, click **Create**
   - Fill in: App name ("GigBoard"), your email
   - Click through to finish
4. Go to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **OAuth client ID**
   - Type: **Web application**
   - Name: "GigBoard"
   - Under **Authorized redirect URIs**, add:
     ```
     https://<your-supabase-project-ref>.supabase.co/auth/v1/callback
     ```
     (Replace `<your-supabase-project-ref>` with the subdomain from your Supabase Project URL)
   - Click **Create**
5. Copy the **Client ID** and **Client Secret**
6. Back in Supabase: go to **Authentication** > **Providers** > **Google**
   - Toggle it **ON**
   - Paste the Client ID and Client Secret
   - Click **Save**

### 1.7 Other Sign-In Providers (optional)

The setup process is the same for all providers: create an app on their developer platform, get a Client ID + Client Secret, set the redirect URI to `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`, and paste the credentials into Supabase.

| Provider | Developer Portal | Notes |
|---|---|---|
| Google | console.cloud.google.com | OAuth consent screen required first |
| Facebook | developers.facebook.com | Create a "Facebook Login" app |
| Apple | developer.apple.com | Requires Apple Developer Program ($99/yr), uses Service ID + private key instead of client secret |
| GitHub | github.com/settings/developers | Simplest setup of all |
| Twitter/X | developer.twitter.com | Need to apply for developer access |
| Discord | discord.com/developers | Very straightforward |

---

## Step 2: Set Up Stripe (Payments)

### 2.1 Create an account

1. Go to [stripe.com](https://stripe.com) and click **Start now**
2. Create an account with your email

### 2.2 Get your test API key

1. Make sure **Test mode** is toggled ON (top-right of the Stripe dashboard)
2. Go to **Developers** > **API keys**
3. Copy the **Secret key** (starts with `sk_test_`)

### 2.3 Set up the webhook

This tells Stripe to notify your website when a payment completes.

1. Go to **Developers** > **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://YOUR-SITE.vercel.app/api/webhooks/stripe`
   (You'll get this URL after deploying in Step 3 — come back to this step after)
4. Under **Select events to listen to**, search for and add: `checkout.session.completed`
5. Click **Add endpoint**
6. On the endpoint page, click **Reveal** under Signing secret
7. Copy the `whsec_...` value

---

## Step 3: Deploy to Vercel (Website Hosting)

### 3.1 Push code to GitHub

If the code isn't already on GitHub:

1. Go to [github.com/new](https://github.com/new) and create a new repository
   - Name: `gigboard`
   - Keep it **Private** if you prefer
   - Click **Create repository**
2. Follow the instructions on the page to push the existing code (or ask your developer to do this step)

### 3.2 Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project**
3. Find and import your `gigboard` repository
4. Before clicking **Deploy**, expand **Environment Variables** and add these:

| Variable Name | Value | Where to find it |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://abcdefg.supabase.co` | Supabase > Settings > API > Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase > Settings > API > anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Supabase > Settings > API > service_role secret |
| `STRIPE_SECRET_KEY` | `sk_test_...` | Stripe > Developers > API keys |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Stripe > Developers > Webhooks > your endpoint |

5. Click **Deploy**
6. Wait 2-3 minutes for the build to complete
7. You'll get a URL like `gigboard-abc123.vercel.app` — this is your live site!

### 3.3 Finish the Stripe webhook setup

Now that you have your Vercel URL, go back to **Step 2.3** and:
- If you already created the endpoint with a placeholder URL, update it to your real Vercel URL
- If you haven't created it yet, do it now with: `https://YOUR-SITE.vercel.app/api/webhooks/stripe`

### 3.4 Custom domain (optional)

If you want a custom domain like `gigboard.com`:

1. In Vercel, go to your project > **Settings** > **Domains**
2. Add your domain name
3. Follow the instructions to update your DNS records (usually at your domain registrar like GoDaddy, Namecheap, etc.)

---

## Step 4: Create Your Admin Account

1. Go to your live site and click **Sign Up**
2. Register with your email
3. Go to Supabase > **SQL Editor** and run:
   ```sql
   UPDATE users SET is_admin = TRUE WHERE email = 'your-email@example.com';
   ```
4. Refresh your site — you'll now see the **Admin** link in the navigation

---

## Step 5: Going Live with Real Payments

The site starts in Stripe **Test Mode** (no real money is charged). When you're ready to accept real payments:

1. In Stripe, complete your account verification (business details, bank account)
2. Toggle **Test mode** OFF in the Stripe dashboard
3. Go to **Developers** > **API keys** and copy the live **Secret key** (starts with `sk_live_`)
4. Create a new webhook endpoint for your live site (same URL, same event)
5. In Vercel, update these environment variables with the live values:
   - `STRIPE_SECRET_KEY` — your live secret key
   - `STRIPE_WEBHOOK_SECRET` — your live webhook signing secret
6. In Vercel, go to **Deployments** and click **Redeploy** on the latest deployment

### Pricing

The current pricing is set to:
- **Featured Gig Listing:** $9.99 for 30 days
- **Premium Musician Profile:** $9.99 for 30 days

To change pricing, ask your developer to update the values in `lib/constants.ts`.

---

## Day-to-Day Admin Tasks

All admin tasks are done from the **Admin Panel** on the website (`/admin`):

| Task | Where |
|---|---|
| View site stats | Admin > Overview |
| Manage users (activate/deactivate, set roles) | Admin > Users |
| Manage gig listings (edit, delete, toggle featured) | Admin > Gig Postings |
| View musician profiles | Admin > Musician Profiles |
| View all applications | Admin > Applications |

### Manually featuring a gig or making a user premium

From the admin panel:
- **Feature a gig:** Go to Admin > Gig Postings > click Edit on a gig > check the "Featured Gig" checkbox
- **Make a user premium:** Run this in Supabase SQL Editor:
  ```sql
  UPDATE users SET is_premium = TRUE, premium_until = NOW() + INTERVAL '30 days'
  WHERE email = 'musician@example.com';
  ```

---

## Troubleshooting

### "Something went wrong" when signing up
- Check that your Supabase URL and anon key are correct in Vercel environment variables
- Make sure you ran all 3 migration SQL files in order

### Google sign-in not working
- Make sure Google is enabled in Supabase > Authentication > Providers
- Check that the redirect URI matches exactly

### Payments not activating featured/premium status
- Make sure the Stripe webhook endpoint URL is correct (must end in `/api/webhooks/stripe`)
- Check that the webhook signing secret (`whsec_...`) matches in Vercel environment variables
- In Stripe > Developers > Webhooks, check for failed delivery attempts

### Site not updating after changes
- In Vercel, go to Deployments and click **Redeploy** on the latest deployment
- Make sure environment variables are saved (Vercel requires a redeploy after changing env vars)

---

## Support

For technical changes (new features, bug fixes, design changes), contact your developer. The admin panel handles all day-to-day operations without needing any code changes.
