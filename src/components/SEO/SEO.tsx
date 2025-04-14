import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import StructuredData from './StructuredData';
import CanonicalUrl from './CanonicalUrl';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: {
    type: 'Organization' | 'WebSite' | 'WebApplication' | 'Breadcrumb';
    data: any;
  };
}

/**
 * SEO component for managing all SEO-related tags and structured data
 * This component handles meta tags, Open Graph tags, Twitter cards,
 * structured data, and canonical URLs
 * 
 * @param title - The title of the page
 * @param description - The description of the page
 * @param keywords - The keywords for the page
 * @param image - The image for the page
 * @param url - The URL for the page
 * @param type - The type of the page
 * @param structuredData - The structured data for the page
 * @returns A Helmet component with all SEO-related tags
 */
const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  structuredData,
}) => {
  const location = useLocation();
  const currentUrl = url || `https://2du.app${location.pathname}`;
  const defaultImage = image || 'https://2du.app/og-image.jpg';

  // Track page view in console (replacing analytics)
  useEffect(() => {
    console.log(`Page view: ${location.pathname} - ${title}`);
  }, [location.pathname, title]);

  return (
    <>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{title}</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={type} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:image" content={defaultImage} />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={defaultImage} />
      </Helmet>
      
      {/* Canonical URL */}
      <CanonicalUrl url={currentUrl} />
      
      {/* Structured Data */}
      {structuredData && (
        <StructuredData
          type={structuredData.type}
          data={structuredData.data}
        />
      )}
    </>
  );
};

export default SEO; 