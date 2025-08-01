# Product Dashboard with User Personas

A modern Next.js product dashboard application designed with two distinct user personas in mind: **Tech-Savvy Customers** and **Casual Shoppers**.

## 🚀 Live Demo

- **GitHub Repository**: [https://github.com/djval79/testdash](https://github.com/djval79/testdash)
- **Netlify Deployment**: [Deploy to Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/djval79/testdash)

## ✨ Features

### 🎯 Tech-Savvy Customer Features
- **Advanced Search**: Search through product descriptions and brand names
- **Multi-Category Filtering**: Select multiple categories simultaneously
- **Price Range Filtering**: Set custom minimum and maximum price limits
- **Rating Filtering**: Filter by minimum star ratings (4.5+, 4.0+, 3.5+, 3.0+)
- **Stock Status Filtering**: Filter by stock levels (In Stock, Low Stock, Out of Stock)
- **Advanced Sorting**: Sort by title, price, rating, or stock with ascending/descending options
- **Active Filters Display**: Visual badges showing applied filters with individual clear options
- **Bulk Operations**: Select multiple products for bulk actions

### 👥 Casual Shopper Features
- **Simple View Toggle**: Switch between "Detailed View" and "Simple View"
- **Simplified Product Cards**: Essential information only (image, title, price)
- **Cleaner Interface**: Reduced visual clutter for easier browsing
- **Intuitive Navigation**: Easy-to-use toggle button in the header

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.5
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Database**: Prisma (SQLite for development)
- **Icons**: Lucide React
- **Deployment**: Netlify

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd product-dashboard-personas
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── api/          # API routes
│   ├── globals.css   # Global styles
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Main dashboard page
├── components/
│   ├── ui/           # Reusable UI components
│   ├── product-card.tsx
│   └── product-modal.tsx
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
└── types/            # TypeScript type definitions
```

## 🎨 User Experience Design

### Tech-Savvy Customer Persona
- **Goal**: Find specific products quickly with detailed filtering
- **Behavior**: Uses multiple filters, compares products, values detailed information
- **Features**: Advanced search, multi-category selection, detailed product cards

### Casual Shopper Persona  
- **Goal**: Browse products easily without overwhelming information
- **Behavior**: Prefers simple interfaces, focuses on essential details
- **Features**: Simple view toggle, clean product cards, minimal clutter

## 🚀 Deployment

### Netlify Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `.next`
   - Deploy!

### Environment Variables

For production deployment, you may need to set up:
- Database connection strings
- API keys (if using external services)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
