This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Tournament Creation Flow (Updated)

1. Pricing selection (Free vs Paid) is now the first mandatory step (component: `PricingTournament`).
   - Persisted in `localStorage` keys:
     - `tournamentPaymentType` = `free` | `paid`
     - `tournamentEntryFee` = numeric string
2. Mode selection (Express / Advanced) appears after pricing.
3. The setup creation form (`/tournament/setup`) includes the pricing values in the API request as:
   - `tournamentType`: `Free` | `Paid`
   - `entryFee`: number (0 if free)
4. Subsequent setup pages (info, brackets, etc.) cache data per tournament id using namespaced keys:
   - `tournamentInfo_<tid>`
   - `backgroundImageData_<tid>` / `backgroundImageName_<tid>`
   - `thumbnailImageData_<tid>` / `thumbnailImageName_<tid>`

Legacy (non-namespaced) keys are still read as fallback to avoid breaking existing drafts, but all new writes prefer namespaced variants once a `tid` is available.

This prevents data from one tournament draft leaking into another when multiple tabs or tournaments are edited.

## Public Tournaments Listing (/tournaments)

The route `/tournaments` lists all published tournaments using the existing `TournamentCard` UI component.

Implementation details:

- Page component: `src/app/tournaments/page.tsx`
- Client listing component: `src/components/tournaments/TournamentsListing.tsx`
- Data source: `getAllTournaments` from `tournamentService` (expects `{ tournaments: [] }` shape)
- Features: client-side search filter, loading state, empty state, responsive grid.
- Linked from Home page via "Show more" button (mobile) and "View all" link (desktop).

### Pagination & Status Tags

- Server-side pagination via `?page=<n>` (page size 12) with bounds redirection.
- Only published tournaments are listed.
- Status tag logic (client):
  - `Ended` (winner present)
  - `Started` (startDate in past, no winner)
  - `Upcoming` (startDate in future)
  - Falls back to original Published/Unpublished badge if statusTag not supplied.

If backend response changes shape, adjust normalization in `TournamentsListing` (`items` extraction) accordingly.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# defendr-front-new

# defendr-front-new
