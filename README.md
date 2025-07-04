# La Placita FTP Website

This is the official website for La Placita FTP, a local grocery store. This project is built with Next.js and provides information about the store's products, services, and promotions. It also includes an admin panel for managing store-related data.

## Features

- **Product Showcase**: Browse through a variety of products available at the store.
- **Services Information**: View details about the services offered, such as money transfers and bill payments.
- **Promotions**: Stay updated with the latest promotions and special offers.
- **Contact Information**: Find the store's address, phone number, and business hours.
- **Admin Panel**: A secure area for administrators to manage exchange rates, products, and promotions.
- **Exchange Rate Management**: Admins can update and display daily exchange rates for different countries.
- **Multi-language Support**: The website supports both English and Spanish.

## Technologies Used

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **API**: Next.js API Routes
- **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v20 or later)
- npm, yarn, or pnpm

### Installation

1. **Clone the repo**
   ```sh
   git clone https://github.com/your_username/laplacita.git
   ```
2. **Navigate to the project directory**
   ```sh
   cd laplacita
   ```
3. **Install NPM packages**
   ```sh
   npm install
   ```
4. **Set up environment variables**
   Create a `.env.local` file in the root of the project and add the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ```
5. **Run the development server**
   ```sh
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

The project follows the standard Next.js `app` directory structure:

- **`app/`**: Contains all the routes, pages, and layouts.
  - **`api/`**: API routes for handling server-side logic.
  - **`admin/`**: Admin-specific pages for managing content.
  - **`(user)/`**: User-facing pages like products, services, and contact.
- **`components/`**: Reusable React components used throughout the application.
- **`contexts/`**: React contexts for managing global state (e.g., language).
- **`lib/`**: Utility functions and database connection logic.
- **`public/`**: Static assets like images, logos, and flags.

## Admin Panel

The admin panel provides functionalities to manage various aspects of the store's website.

### Exchange Rate Management

The exchange rate page (`/admin/exchangerate`) allows administrators to:

- **Update Exchange Rates**: Input and save the daily exchange rates for various countries and banks.
- **Generate PNG/PDF**: Create and download a formatted image or PDF of the exchange rates for printing or sharing.
- **Preview**: Preview the generated exchange rate template before downloading.

## API Endpoints

The following are the main API endpoints used in the application:

- **`GET /api/admin/products`**: Fetches a list of all products.
- **`POST /api/admin/products`**: Adds a new product.
- **`PUT /api/admin/products/[id]`**: Updates an existing product.
- **`DELETE /api/admin/products/[id]`**: Deletes a product.

## Deployment

This application is optimized for deployment on [Vercel](https://vercel.com/), the platform from the creators of Next.js.

To deploy your own instance, you can use the Vercel CLI or connect your Git repository to Vercel for automatic deployments.

---

This `README.md` provides a comprehensive overview of the La Placita FTP website project. If you have any questions or suggestions, please feel free to open an issue or contact the project maintainer.
