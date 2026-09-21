"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  User,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Globe,
  Layers,
  ShoppingBag,
  Smartphone,
  Target,
  Share2,
  Palette,
  ShieldCheck,
} from "lucide-react";
import SearchModal from "../search/SearchModal";

export interface NavItem {
  name: string;
  href: string;
  sectionId: string;
  hasDropdown?: boolean;
}

export const SERVICES_CATALOG = {
  weBuild: [
    {
      title: "Website Development",
      desc: "Fast, SEO-ready websites that turn visitors into enquiries.",
      icon: Globe,
    },
    {
      title: "Web Application Development",
      desc: "Custom portals, dashboards and SaaS — proven at enterprise scale.",
      icon: Layers,
    },
    {
      title: "eCommerce Development",
      desc: "Stores built for Indian reality: UPI, GST, Shiprocket-ready.",
      icon: ShoppingBag,
    },
    {
      title: "Mobile App Development",
      desc: "Android, iOS and Flutter apps people actually keep.",
      icon: Smartphone,
    },
  ],
  weGrow: [
    {
      title: "Digital Marketing",
      desc: "Local SEO, advertising and content measured in enquiries and sales.",
      icon: Target,
    },
    {
      title: "Social Media Management",
      desc: "Content and ads measured in enquiries, not likes.",
      icon: Share2,
    },
    {
      title: "Content Creation",
      desc: "Writing, photo and video that Google finds and customers believe.",
      icon: Sparkles,
    },
    {
      title: "Graphic Design & Branding",
      desc: "Logos and identities designed to be remembered.",
      icon: Palette,
    },
    {
      title: "Website Security & Maintenance",
      desc: "Malware removal, backups and AMC plans. Sleep well.",
      icon: ShieldCheck,
    },
  ],
};

export const NAV_ITEMS: NavItem[] = [
  { name: "Home", href: "/#home", sectionId: "home" },
  { name: "Intelligence", href: "/#intelligence", sectionId: "intelligence" },
  { name: "Solutions", href: "/#solutions", sectionId: "solutions" },
  { name: "Services", href: "/#solutions", sectionId: "solutions", hasDropdown: true },
  { name: "Academy", href: "/#academy", sectionId: "academy" },
  { name: "Showcase", href: "/#showcase", sectionId: "showcase" },
  { name: "Creators", href: "/#creators", sectionId: "creators" },
  { name: "Let's Talk", href: "/#contact", sectionId: "contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState<boolean>(false);
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState<boolean>(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Set up IntersectionObserver on landing page for dynamic active state highlight
  useEffect(() => {
    if (pathname !== "/") return;

    const observerCallback: IntersectionObserverCallback = (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible.length > 0) {
        setActiveSection(visible[0].target.id);
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "-20% 0px -40% 0px",
      threshold: [0.1, 0.3, 0.5, 0.7],
    });

    ["home", "intelligence", "solutions", "academy", "showcase", "creators", "contact"].forEach(
      (id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      }
    );

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  // Smooth scroll handler for both same-page and cross-page navigation
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    sectionId: string
  ) => {
    if (pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        setActiveSection(sectionId);
        window.history.pushState(null, "", `#${sectionId}`);
      }
      setMobileMenuOpen(false);
      setServicesDropdownOpen(false);
    } else {
      setMobileMenuOpen(false);
      setServicesDropdownOpen(false);
    }
  };

  const handleSelectServiceItem = (serviceName: string) => {
    setServicesDropdownOpen(false);
    setMobileMenuOpen(false);
    if (pathname === "/") {
      const el = document.getElementById("solutions") || document.getElementById("contact");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push("/#solutions");
    }
  };

  const handleMouseEnterServices = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setServicesDropdownOpen(true);
  };

  const handleMouseLeaveServices = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setServicesDropdownOpen(false);
    }, 150);
  };

  const handleSelectFromSearch = (sectionId: string) => {
    if (pathname === "/") {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        setActiveSection(sectionId);
        window.history.pushState(null, "", `#${sectionId}`);
      }
    } else {
      router.push(`/#${sectionId}`);
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 z-50 w-full px-3 sm:px-6 py-4"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-3xl border border-white/10 bg-white/[0.04] px-4 sm:px-6 py-3.5 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          {/* Brand Logo */}
          <Link
            href="/#home"
            onClick={(e) => handleNavClick(e, "home")}
            className="group flex items-center gap-3"
          >
            <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] p-1.5 backdrop-blur-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300 group-hover:scale-105 group-hover:border-blue-500/50">
              <img
                src="/logo.png"
                alt="WorknAI Logo"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <h2 className="font-bold text-sm sm:text-base text-white tracking-wide transition-colors group-hover:text-blue-300">
                WorknAI<span className="text-blue-400">.media</span>
              </h2>
              <p className="text-[10px] text-zinc-400">Business Media OS</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-1 xl:gap-1.5 lg:flex">
            {NAV_ITEMS.map((link) => {
              const isActive = activeSection === link.sectionId;
              const isContact = link.sectionId === "contact";

              if (link.hasDropdown) {
                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={handleMouseEnterServices}
                    onMouseLeave={handleMouseLeaveServices}
                  >
                    <button
                      onClick={() => setServicesDropdownOpen((prev) => !prev)}
                      className={`group relative flex items-center gap-1 px-3 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 rounded-full ${
                        servicesDropdownOpen || isActive
                          ? "text-white bg-white/10 shadow-[0_0_12px_rgba(59,130,246,0.35)] border border-white/15"
                          : "text-zinc-300 hover:text-white hover:bg-white/[0.05]"
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 group-hover:text-white ${
                          servicesDropdownOpen ? "rotate-180 text-blue-400" : ""
                        }`}
                      />
                    </button>

                    {/* Services Mega Dropdown Panel */}
                    <AnimatePresence>
                      {servicesDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 12, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.98 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          className="absolute -left-28 top-full mt-3 w-[700px] overflow-hidden rounded-3xl border border-white/15 bg-[#070b1e]/95 p-6 sm:p-7 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-50"
                        >
                          <div className="grid grid-cols-2 gap-7">
                            {/* Column 1: WE BUILD */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                <span className="text-[11px] font-black uppercase tracking-widest text-[#ff5722]">
                                  WE BUILD
                                </span>
                              </div>

                              <div className="space-y-3.5">
                                {SERVICES_CATALOG.weBuild.map((item, idx) => {
                                  const Icon = item.icon;
                                  return (
                                    <button
                                      key={idx}
                                      onClick={() => handleSelectServiceItem(item.title)}
                                      className="group/item flex w-full items-start gap-3 rounded-xl p-2 text-left transition hover:bg-white/5"
                                    >
                                      <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-orange-400 transition group-hover/item:border-orange-500/40 group-hover/item:bg-orange-500/10">
                                        <Icon className="h-4 w-4" />
                                      </div>
                                      <div>
                                        <h4 className="text-xs font-bold text-white transition group-hover/item:text-orange-300">
                                          {item.title}
                                        </h4>
                                        <p className="mt-0.5 text-[11px] leading-snug text-zinc-400">
                                          {item.desc}
                                        </p>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Column 2: WE GROW */}
                            <div className="space-y-4 border-l border-white/10 pl-7">
                              <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                <span className="text-[11px] font-black uppercase tracking-widest text-[#ff5722]">
                                  WE GROW
                                </span>
                              </div>

                              <div className="space-y-3.5">
                                {SERVICES_CATALOG.weGrow.map((item, idx) => {
                                  const Icon = item.icon;
                                  return (
                                    <button
                                      key={idx}
                                      onClick={() => handleSelectServiceItem(item.title)}
                                      className="group/item flex w-full items-start gap-3 rounded-xl p-2 text-left transition hover:bg-white/5"
                                    >
                                      <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-blue-400 transition group-hover/item:border-blue-500/40 group-hover/item:bg-blue-500/10">
                                        <Icon className="h-4 w-4" />
                                      </div>
                                      <div>
                                        <h4 className="text-xs font-bold text-white transition group-hover/item:text-blue-300">
                                          {item.title}
                                        </h4>
                                        <p className="mt-0.5 text-[11px] leading-snug text-zinc-400">
                                          {item.desc}
                                        </p>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Footer CTA */}
                          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs">
                            <span className="text-zinc-400">
                              Custom enterprise architecture or technical audit?
                            </span>
                            <a
                              href="/#contact"
                              onClick={(e) => handleNavClick(e, "contact")}
                              className="flex items-center gap-1 font-bold text-blue-400 hover:text-blue-300"
                            >
                              <span>Talk to an Architect</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              if (isContact) {
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.sectionId)}
                    className="ml-2 inline-flex items-center gap-1.5 rounded-full border border-blue-500/50 bg-gradient-to-r from-blue-600/80 to-cyan-500/80 px-4 py-1.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all duration-200 hover:scale-105 hover:shadow-[0_0_25px_rgba(59,130,246,0.7)]"
                  >
                    <span>{link.name}</span>
                    <Sparkles className="h-3 w-3" />
                  </a>
                );
              }

              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.sectionId)}
                  className={`relative px-3 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 rounded-full ${
                    isActive
                      ? "text-white bg-white/10 shadow-[0_0_12px_rgba(59,130,246,0.35)] border border-white/15"
                      : "text-zinc-300 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute inset-0 rounded-full border border-blue-400/40 -z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action Icons (Mobile Hamburger Menu) */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300 transition hover:border-blue-500/40 hover:bg-white/10 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 max-h-[85vh] overflow-y-auto rounded-3xl border border-white/15 bg-[#050816]/95 p-5 backdrop-blur-2xl shadow-2xl lg:hidden"
            >
              <div className="flex flex-col gap-2">
                {NAV_ITEMS.map((link) => {
                  const isActive = activeSection === link.sectionId;
                  const isContact = link.sectionId === "contact";

                  if (link.hasDropdown) {
                    return (
                      <div key={link.name} className="flex flex-col">
                        <button
                          onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                          className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                            mobileServicesOpen
                              ? "bg-white/10 text-white border border-white/15"
                              : "text-zinc-300 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{link.name}</span>
                            <span className="rounded bg-orange-500/20 px-1.5 py-0.5 text-[10px] font-bold text-orange-400 uppercase">
                              Dropdown
                            </span>
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                              mobileServicesOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {/* Accordion List for Mobile */}
                        {mobileServicesOpen && (
                          <div className="mt-2 space-y-3 rounded-2xl bg-black/40 p-4 border border-white/10">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-wider text-[#ff5722] mb-2">
                                WE BUILD
                              </p>
                              <div className="space-y-2">
                                {SERVICES_CATALOG.weBuild.map((s, i) => (
                                  <button
                                    key={i}
                                    onClick={() => handleSelectServiceItem(s.title)}
                                    className="flex w-full items-start gap-2.5 text-left text-xs text-zinc-300 py-1 hover:text-white"
                                  >
                                    <span className="text-orange-400 font-bold">•</span>
                                    <div>
                                      <p className="font-semibold text-white">{s.title}</p>
                                      <p className="text-[10px] text-zinc-400">{s.desc}</p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="pt-2 border-t border-white/10">
                              <p className="text-[10px] font-black uppercase tracking-wider text-[#ff5722] mb-2">
                                WE GROW
                              </p>
                              <div className="space-y-2">
                                {SERVICES_CATALOG.weGrow.map((s, i) => (
                                  <button
                                    key={i}
                                    onClick={() => handleSelectServiceItem(s.title)}
                                    className="flex w-full items-start gap-2.5 text-left text-xs text-zinc-300 py-1 hover:text-white"
                                  >
                                    <span className="text-blue-400 font-bold">•</span>
                                    <div>
                                      <p className="font-semibold text-white">{s.title}</p>
                                      <p className="text-[10px] text-zinc-400">{s.desc}</p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.sectionId)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                        isContact
                          ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                          : isActive
                          ? "bg-white/10 text-white border border-white/15"
                          : "text-zinc-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span>{link.name}</span>
                      {isContact ? (
                        <Sparkles className="h-4 w-4" />
                      ) : (
                        <ArrowRight className="h-4 w-4 text-zinc-500" />
                      )}
                    </a>
                  );
                })}
              </div>

              {/* Quick Search trigger in mobile */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchModalOpen(true);
                }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-2.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 transition"
              >
                <Search size={14} />
                <span>Search ecosystem (Ctrl+K)</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectSection={handleSelectFromSearch}
      />
    </>
  );
}