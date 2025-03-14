# GUTTR - Music Platform for Artists and Listeners

GUTTR is a modern music platform that combines the best features of Bandcamp, Spotify, and BeatStars. It's designed to be AI music-friendly and provides a comprehensive ecosystem for artists to share, sell their music, and connect with fans.

## Features

### For Artists
- **Artist Profiles**: Create customizable artist pages with bio, discography, and social links
- **Music Upload**: Upload tracks and albums with metadata, including AI-generated music
- **Monetization**: Sell tracks, albums, beats with customizable licensing options
- **Merchandise**: Sell merchandise with fan-designed options
- **Affiliate Program**: Set custom affiliate rates for marketplace items
- **Analytics**: Track plays, sales, and earnings

### For Listeners
- **Music Discovery**: Explore new music through AI-generated genre and artist radio
- **Playlists**: Create and share playlists with the community
- **Earn While Listening**: Earn from ad revenue when listening to radio content
- **Merchandise Design**: Upload merch designs and earn royalties from sales
- **Affiliate Program**: Earn by sharing and promoting artists and tracks

### Platform Features
- **Revenue Sharing**: Fair revenue distribution between platform, artists, and listeners
- **AI Integration**: AI-powered music tagging, recommendations, and radio stations
- **Social Features**: Follow artists, comment on tracks, and share content

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage, Cloudinary
- **Payments**: Stripe Connect
- **State Management**: Zustand

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Supabase account
- Stripe account
- Cloudinary account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/guttr.git
   cd guttr
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your database, Supabase, Stripe, and Cloudinary credentials

4. Set up the database:
   ```bash
   npx prisma migrate dev --name init
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
guttr/
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   ├── artists/          # Artist pages
│   ├── tracks/           # Track pages
│   ├── albums/           # Album pages
│   ├── marketplace/      # Marketplace pages
│   ├── dashboard/        # User dashboard
│   ├── auth/             # Authentication pages
│   ├── radio/            # Radio pages
│   └── components/       # Shared components
├── components/           # Global components
├── lib/                  # Utility libraries
├── prisma/               # Prisma schema and migrations
├── public/               # Static assets
└── utils/                # Helper functions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Supabase](https://supabase.io/)
- [Stripe](https://stripe.com/)
- [Tailwind CSS](https://tailwindcss.com/)
