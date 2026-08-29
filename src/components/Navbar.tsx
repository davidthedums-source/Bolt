import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Phone, 
  MessageSquare, 
  Menu, 
  X, 
  ChevronRight,
  ShieldCheck,
  Clock,
  Search,
  User,
  ShieldAlert
} from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenQuoteModal: (prefillCategory?: string) => void;
  onOpenTrackerModal: () => void;
  onOpenPortalModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenQuoteModal,
  onOpenTrackerModal,
  onOpenPortalModal
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { user, profile, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Track active section
      const sections = ['home', 'services', 'repairs', 'products', 'why-bolt', 'about', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home', color: 'hover:text-blue-600' },
    { name: 'Services', href: '#services', id: 'services', color: 'hover:text-purple-600' },
    { name: 'Repairs', href: '#repairs', id: 'repairs', color: 'hover:text-emerald-600' },
    { name: 'Products', href: '#products', id: 'products', color: 'hover:text-orange-600' },
    { name: 'Why Bolt', href: '#why-bolt', id: 'why-bolt', color: 'hover:text-blue-600' },
    { name: 'About', href: '#about', id: 'about', color: 'hover:text-rose-600' },
    { name: 'Contact', href: '#contact', id: 'contact', color: 'hover:text-cyan-600' },
  ];

  return (
    <header 
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200/80 py-2.5' 
          : 'bg-white/90 backdrop-blur-sm py-3.5 border-b border-slate-100'
      }`}
    >
      {/* Top emergency / notice ticker */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <a 
            href="#home" 
            id="nav-brand-logo"
            className="flex items-center gap-3 group text-decoration-none focus:outline-none"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300 stroke-[2.5]" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-xl font-display text-slate-900 leading-none group-hover:text-blue-600 transition-colors">
                  BOLT
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                  TECH
                </span>
              </div>
              <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase mt-0.5">
                Computer Services
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                    isActive 
                      ? 'text-blue-700 bg-blue-50 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden sm:flex items-center gap-2">
            
            {/* Live Diagnostic Tracker */}
            <button
              onClick={onOpenTrackerModal}
              id="nav-track-button"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-blue-600" />
              <span>Track Repair</span>
            </button>

            {/* Portal / Account Button */}
            <button
              onClick={onOpenPortalModal}
              id="nav-portal-button"
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                user 
                  ? 'bg-blue-50 text-blue-700 border-blue-200' 
                  : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100 border-slate-200'
              }`}
            >
              {isAdmin ? (
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              ) : (
                <User className="w-3.5 h-3.5 text-slate-600" />
              )}
              <span>{user ? (isAdmin ? 'Admin Portal' : profile?.displayName || 'My Portal') : 'Sign In'}</span>
            </button>

            {/* Direct WhatsApp Callout */}
            <a
              href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=Hello%20Bolt%20Computer%20Services,%20I%20would%20like%20to%20inquire%20about%20your%20services.`}
              target="_blank"
              rel="noopener noreferrer"
              id="nav-whatsapp-cta"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            {/* Quick Quote Button */}
            <button
              onClick={() => onOpenQuoteModal()}
              id="nav-quote-button"
              className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm shadow-blue-500/30 hover:shadow-md transition-all duration-150 cursor-pointer"
            >
              <span>Get Quote</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenTrackerModal}
              className="text-xs font-bold px-2.5 py-1.5 bg-slate-100 text-slate-700 rounded-lg sm:hidden flex items-center gap-1"
            >
              <Search className="w-3 h-3 text-blue-600" />
              <span>Track</span>
            </button>
            <button
              onClick={() => onOpenQuoteModal()}
              className="text-xs font-bold px-3 py-1.5 bg-blue-600 text-white rounded-lg sm:hidden"
            >
              Quote
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div 
          id="mobile-nav-drawer"
          className="lg:hidden bg-white border-b border-slate-200 shadow-xl px-4 pt-3 pb-6 mt-3 space-y-2 animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  activeSection === link.id 
                    ? 'bg-blue-50 text-blue-700 font-bold' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTrackerModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold text-slate-800 bg-slate-100 hover:bg-slate-200"
            >
              <Search className="w-4 h-4 text-blue-600" />
              <span>Track Device Repair Status</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPortalModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200"
            >
              <User className="w-4 h-4 text-blue-600" />
              <span>{user ? (isAdmin ? 'Admin Technician Portal' : 'My Repair Portal') : 'Sign In to Portal'}</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuoteModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20"
            >
              <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span>Request a Service Quote</span>
            </button>

            <a
              href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=Hello%20Bolt%20Computer%20Services,%20I%20need%20quick%20support.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold text-emerald-800 bg-emerald-50 border border-emerald-200"
            >
              <MessageSquare className="w-4 h-4 fill-emerald-600 text-emerald-600" />
              <span>Chat Directly on WhatsApp</span>
            </a>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              {COMPANY_INFO.workingHours}
            </span>
            <span className="flex items-center gap-1 font-medium text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Ikeja Laboratory
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
