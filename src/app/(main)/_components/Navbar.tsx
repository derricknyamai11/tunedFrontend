"use client";

import Link, { type LinkProps } from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
// import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ServicesDropdown } from "./ServicesDropdown";
import { MobileServicesMenu } from "./MobileServicesMenu";
import { NavbarAuthSection } from "./NavbarAuthSection";
import { MobileNavbarAuthSection } from "./MobileNavbarAuthSection";
import { useNavbar } from "@/lib/hooks/useNavbar";
import { useNavbarServices } from "@/lib/hooks/useNavbarServices";
import type { NavbarProps } from "@/lib/props/index.props";
import type { NavLink } from "@/lib/types/common.type";

const NAV_LINKS: NavLink[] = [
  { label: "Services",     href: "/services" },
  { label: "FAQs",         href: "/faqs" },
  { label: "Samples",      href: "/samples" },
  { label: "Blogs",        href: "/blogs" },
  { label: "Testimonials", href: "/testimonials" },
];

export function Navbar({ activeRoute = "/" }: NavbarProps) {
  const { 
    mobileOpen, 
    scrolled, 
    toggleMobileMenu 
  } = useNavbar(activeRoute);

  const { 
    isOpen: servicesOpen, 
    toggleDropdown, 
    closeDropdown, 
    categories, 
    isLoading: isServicesLoading,
    activeCategoryId,
    setActiveCategoryId,
    activeServices,
    isServicesLoading: isCategoryServicesLoading,
    dropdownRef
  } = useNavbarServices();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-shadow duration-300",
        scrolled ? "shadow-md bg-white/95 backdrop-blur-md" : "bg-white"
      )}
    >
      <nav
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-2xl font-black text-slate-900 select-none tracking-tight group"
          aria-label="TunedEssays home"
        >
          <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform duration-300">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 21C7 14 13 7 21 3C19 11 14 18 4 21Z" fill="currentColor" opacity="0.9" />
              <path d="M4 21C6 17 9 13 13 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="flex items-center gap-0.5">
            Tuned<span className="text-emerald-500">Essays</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-2" role="list">
          {NAV_LINKS.map((link) => {
            const isActive = activeRoute === link.href || (link.label === "Services" && activeRoute.startsWith("/service/"));
            
            if (link.label === "Services") {
              return (
                <li key={link.label} className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className={cn(
                      "px-5 py-2.5 rounded-full text-[15px] font-bold transition-all duration-200 flex items-center gap-1.5",
                      servicesOpen || isActive
                        ? "text-emerald-700 bg-emerald-50 shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                    aria-expanded={servicesOpen}
                    aria-haspopup="true"
                    id="services-menu-button"
                  >
                    Services
                    <ChevronDown 
                      size={16} 
                      className={cn("transition-transform duration-300", servicesOpen && "rotate-180")} 
                    />
                  </button>
                  
                  <ServicesDropdown 
                    categories={categories} 
                    isOpen={servicesOpen} 
                    onClose={closeDropdown}
                    isLoading={isServicesLoading}
                    activeCategoryId={activeCategoryId}
                    onCategorySelect={setActiveCategoryId}
                    services={activeServices}
                    isServicesLoading={isCategoryServicesLoading}
                  />
                </li>
              );
            }

            return (
              <li key={link.href}>
                <Link
                  href={link.href as LinkProps<string>["href"]}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-[15px] font-bold transition-all duration-200",
                    isActive
                      ? "text-emerald-700 bg-emerald-50 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop Actions — auth-aware (loading / authenticated / unauthenticated) */}
        <div className="hidden md:flex items-center gap-4">
          <NavbarAuthSection />
        </div>

        {/* Mobile Toggle */}
        <button
          className={cn(
            "md:hidden rounded-xl p-2.5 transition-all duration-200",
            mobileOpen ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-100"
          )}
          onClick={toggleMobileMenu}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          {mobileOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="md:hidden fixed inset-x-0 top-20 bottom-0 bg-white z-50 overflow-y-auto animate-in slide-in-from-top-1 px-4 py-6"
        >
          <ul className="flex flex-col gap-2" role="list">
            {NAV_LINKS.map((link) => {
              const isActive = activeRoute === link.href || (link.label === "Services" && activeRoute.startsWith("/service/"));

              if (link.label === "Services") {
                return (
                  <li key={link.label} className="mb-2">
                    <MobileServicesMenu categories={categories} />
                  </li>
                );
              }

              return (
                <li key={link.href}>
                  <Link
                    href={link.href as LinkProps<string>["href"]}
                    className={cn(
                      "block px-5 py-4 rounded-2xl text-[16px] font-bold transition-all",
                      isActive
                        ? "text-emerald-700 bg-emerald-50"
                        : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          
          {/* Mobile auth — auth-aware (loading / authenticated / unauthenticated) */}
          <div className="mt-8">
            <MobileNavbarAuthSection />
          </div>
        </div>
      )}
    </header>
  );
}
