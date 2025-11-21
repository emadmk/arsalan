"use client";

import { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { HeroSection } from '../components/HeroSection';
import { ProductShowcase } from '../components/ProductShowcase';
import { CountdownTimer } from '../components/CountdownTimer';
import { CustomerTestimonials } from '../components/CustomerTestimonials';
import { ProvenanceCards } from '../components/ProvenanceCards';
import { PricingSection } from '../components/PricingSection';
import { InvestmentCalculator } from '../components/InvestmentCalculator';
import { HeritageTimeline } from '../components/HeritageTimeline';
import { GridSelection } from '../components/GridSelection';
import { CarpetHeritageSection } from '../components/CarpetHeritageSection';
import { FAQSection } from '../components/FAQSection';
import { Footer } from '../components/Footer';
import { AuthModal } from '../components/auth/AuthModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { CryptoPaymentGateway } from '../components/CryptoPaymentGateway';

export function HomePage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<'login' | 'register'>('login');

  const handleReserveClick = () => {
    // For now, just open payment modal
    // In production, check auth first
    setPaymentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <Navigation
        onLoginClick={() => {
          setAuthDefaultTab('login');
          setAuthModalOpen(true);
        }}
        onSignUpClick={() => {
          setAuthDefaultTab('register');
          setAuthModalOpen(true);
        }}
      />

      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <HeroSection onReserveClick={handleReserveClick} />

        {/* Product Showcase - Desktop only */}
        <div className="hidden lg:block">
          <ProductShowcase />
        </div>

        {/* Countdown Timer - Desktop only */}
        <div className="hidden lg:block">
          <CountdownTimer />
        </div>

        {/* Customer Testimonials */}
        <CustomerTestimonials />

        {/* Pricing Section - Desktop only */}
        <div className="hidden lg:block">
          <PricingSection onReserveClick={handleReserveClick} />
        </div>

        {/* Investment Calculator - Desktop only */}
        <div className="hidden lg:block">
          <InvestmentCalculator />
        </div>

        {/* Heritage Timeline - Desktop only */}
        <div className="hidden lg:block">
          <HeritageTimeline />
        </div>

        {/* Grid Selection */}
        <GridSelection />

        {/* Persian Carpet Heritage - Desktop only */}
        <div className="hidden lg:block">
          <CarpetHeritageSection />
        </div>

        {/* FAQ Section - Desktop only */}
        <div className="hidden lg:block">
          <FAQSection />
        </div>

        {/* Provenance Cards */}
        <ProvenanceCards />
      </main>

      {/* Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        defaultTab={authDefaultTab}
      />

      {/* Payment Modal */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display">
              Reserve Your <span className="text-carpet-antique-gold">Heritage Piece</span>
            </DialogTitle>
          </DialogHeader>
          <CryptoPaymentGateway
            amountUsd={100}
            onPaymentComplete={() => {
              setPaymentModalOpen(false);
              // Show success message or redirect
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
