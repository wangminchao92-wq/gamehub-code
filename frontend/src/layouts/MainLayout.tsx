import React from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

export default function MainLayout({
  children,
  title = 'GameHub - Your Ultimate Gaming Destination',
  description = 'Latest gaming news, reviews, guides, and community discussions. Stay updated with the gaming world.',
  keywords = 'gaming, news, reviews, guides, esports, community',
  ogImage = '/images/og-default.jpg',
}: MainLayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        
        {/* Additional meta tags */}
        <meta name="theme-color" content="#0ea5e9" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      
      <ThemeProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    </>
  );
}