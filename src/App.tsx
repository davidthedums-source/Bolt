/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { RepairsSection } from './components/RepairsSection';
import { ProductsSection } from './components/ProductsSection';
import { WhyBoltSection } from './components/WhyBoltSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { 
  ServiceDetailModal, 
  ProductDetailModal, 
  QuickQuoteModal 
} from './components/Modals';
import { RepairTrackerModal } from './components/RepairTrackerModal';
import { UserPortalModal } from './components/UserPortalModal';
import { ServiceItem, ProductItem } from './types';
import { COMPANY_INFO } from './data/mockData';

export default function App() {
  // Modal states
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quotePrefillCategory, setQuotePrefillCategory] = useState<string | undefined>(undefined);
  
  // Real-time Firebase Modals
  const [trackerModalOpen, setTrackerModalOpen] = useState(false);
  const [trackerPrefillCode, setTrackerPrefillCode] = useState<string | undefined>(undefined);
  const [portalModalOpen, setPortalModalOpen] = useState(false);

  const handleOpenQuote = (category?: string) => {
    setQuotePrefillCategory(category);
    setQuoteModalOpen(true);
  };

  const handleOpenTracker = (code?: string) => {
    setTrackerPrefillCode(code);
    setTrackerModalOpen(true);
  };

  const handleEnquireProduct = (product: ProductItem) => {
    const text = encodeURIComponent(
      `Hello Bolt Computer Services! I would like to inquire about the *${product.name}* (${product.condition}, ${product.specs[0]}). Please confirm availability and pricing.`
    );
    window.open(`https://wa.me/${COMPANY_INFO.whatsapp}?text=${text}`, '_blank');
  };

  const handleRequestServiceFromModal = (serviceTitle: string) => {
    setSelectedService(null);
    handleOpenQuote(serviceTitle);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white font-sans antialiased">
        
        {/* Top Fixed Header Navbar */}
        <Navbar 
          onOpenQuoteModal={handleOpenQuote}
          onOpenPortalModal={() => setPortalModalOpen(true)}
        />

        {/* Main Content Sections */}
        <main className="flex-1">
          
          {/* Section 1: HOME (Blue + White Theme) */}
          <HeroSection onOpenQuoteModal={() => handleOpenQuote('General Computer Service')} />

          {/* Section 2: SERVICES (Purple + White Theme) */}
          <ServicesSection 
            onSelectService={(service) => setSelectedService(service)}
            onOpenQuoteModal={handleOpenQuote}
          />

          {/* Section 3: REPAIRS (Green + Dark Charcoal Theme) */}
          <RepairsSection 
            onOpenQuoteModal={handleOpenQuote}
          />

          {/* Section 4: PRODUCTS (Orange + White Theme) */}
          <ProductsSection 
            onSelectProduct={(product) => setSelectedProduct(product)}
            onOpenQuoteModal={(prodName) => handleOpenQuote(`Product Inquiry: ${prodName}`)}
          />

          {/* Section 5: WHY BOLT (4 Colorful Feature Cards) */}
          <WhyBoltSection />

          {/* Section 6: ABOUT (Red/Coral + White Theme) */}
          <AboutSection onOpenQuoteModal={() => handleOpenQuote('General Consultation')} />

          {/* Section 7: CONTACT (Cyan + Dark Charcoal Theme) */}
          <ContactSection 
            initialService={quotePrefillCategory}
          />

        </main>

        {/* Footer */}
        <Footer 
          onOpenQuoteModal={handleOpenQuote}
          onOpenPortalModal={() => setPortalModalOpen(true)}
        />

        {/* Fixed Floating WhatsApp Direct Action Button */}
        <FloatingWhatsApp />

        {/* Core Modals */}
        <ServiceDetailModal 
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onRequestQuote={handleRequestServiceFromModal}
        />

        <ProductDetailModal 
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onEnquire={handleEnquireProduct}
        />

        <QuickQuoteModal 
          isOpen={quoteModalOpen}
          onClose={() => setQuoteModalOpen(false)}
          prefillService={quotePrefillCategory}
        />

        {/* Firebase Powered Modals */}
        <RepairTrackerModal 
          isOpen={trackerModalOpen}
          onClose={() => setTrackerModalOpen(false)}
          initialTrackingCode={trackerPrefillCode}
        />

        <UserPortalModal 
          isOpen={portalModalOpen}
          onClose={() => setPortalModalOpen(false)}
          onOpenQuoteModal={() => handleOpenQuote()}
        />

      </div>
    </AuthProvider>
  );
}
