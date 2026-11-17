
"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { prefersReducedMotion } from "../Animations/reducedMotion";
import { useMagnetic } from "../Animations/useMagnetic";
import Button from "../Buttons/Button";
import { BRAND } from "../../brand";
import SoundToggle from "../Sound/SoundToggle";
import BrandMark from "./BrandMark";
import { COVERED_EVENT } from "../effects/page-transition";
import { STACK_LOADER_HANDOFF, stackLoaderActive, stackLoaderLead, stackLoaderPlaying } from "../effects/stack-loader";
import { NAV_LINKS, ROUTES } from "../../routes";

const Menu = dynamic(() => import("./Menu"), { ssr: false });

gsap.registerPlugin(useGSAP);

const MENU_OPEN_LOCK = 1100;
const MENU_CLOSE_LOCK = 900;
const DESKTOP = "(min-width: 1024px)";

const isCurrent = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

// The desktop links in a black pill. A blue lozenge rests behind the current page and slides
// to whichever link is hovered or focused.
const NavPill = ({ pathname }: { pathname: string }) => {
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const previousRef = useRef<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  // jump: the lozenge is appearing from nothing, so it takes its place without sliding
  const [box, setBox] = useState({ left: 0, width: 0, jump: true });
  const current = NAV_LINKS.findIndex((link) => isCurrent(pathname, link.href));
  const target = hovered ?? (current >= 0 ? current : null);

  const measure = useCallback(() => {
    const link = target === null ? null : linkRefs.current[target];
    if (link) setBox({ left: link.offsetLeft, width: link.offsetWidth, jump: previousRef.current === null });
    previousRef.current = target;
  }, [target]);

  useLayoutEffect(measure, [measure]);

  useEffect(() => {
    const remeasure = () => {
      const link = previousRef.current === null ? null : linkRefs.current[previousRef.current];
      if (link) setBox({ left: link.offsetLeft, width: link.offsetWidth, jump: true });
    };
    window.addEventListener("resize", remeasure);
    document.fonts?.ready.then(remeasure);
    return () => window.removeEventListener("resize", remeasure);
  }, []);

  return (
    <nav aria-label="Main" data-cursor-quiet className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-lg:hidden">
      <ul
        onPointerLeave={() => setHovered(null)}
        className="relative flex items-center rounded-full bg-(--raven-ink) p-[0.3vw]"
      >
        <span
          aria-hidden
          className={`absolute inset-y-[0.3vw] left-0 rounded-full bg-(--raven-accent) ease-[cubic-bezier(0.2,1,0.3,1)] motion-reduce:transition-none ${
            box.jump ? "transition-opacity duration-300" : "transition-[transform,width,opacity] duration-500"
          } ${target === null ? "opacity-0" : "opacity-100"}`}
          style={{ width: box.width, transform: `translateX(${box.left}px)` }}
        />
        {NAV_LINKS.map((link, index) => (
          <li key={link.href}>
            <Link
              ref={(el) => {
                linkRefs.current[index] = el;
              }}
              href={link.href}
              aria-current={index === current ? "page" : undefined}
              onPointerEnter={() => setHovered(index)}
              onFocus={() => setHovered(index)}
              onBlur={() => setHovered(null)}
              className={`font-raven-head relative flex h-[4.6vh] items-center rounded-full px-[1.2vw] text-22 font-medium leading-none transition-colors duration-300 ${
                index === target ? "text-(color:--raven-white)" : "text-(color:--raven-white)/70 hover:text-(color:--raven-white)"
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

const Header = () => {
  const lenis = useLenis();
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const barTopRef = useRef<HTMLSpanElement | null>(null);
  const barBottomRef = useRef<HTMLSpanElement | null>(null);
  const lastYRef = useRef(0);
  const menuLockRef = useRef(0);
  const hiddenRef = useRef(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuReady, setMenuReady] = useState(false);
  const [instantClose, setInstantClose] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Route change: close the menu instantly (state adjusted during render, not in an effect)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setInstantClose(true);
    setMenuOpen(false);
  }

  useEffect(() => {
    const id = window.setTimeout(() => setMenuReady(true), 2500);
    return () => window.clearTimeout(id);
  }, []);

  useMagnetic(menuButtonRef, 0.2);

  // Hide while scrolling down, come back on the way up; a soft bar once off the top
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const handleScroll = () => {
      const y = window.scrollY;
      const delta = y - lastYRef.current;
      setScrolled(y > 24);

      if (!document.documentElement.hasAttribute("data-raven-menu-open") && Math.abs(delta) > 2) {
        const hide = delta > 0 && y > 400;
        if (hide !== hiddenRef.current) {
          hiddenRef.current = hide;
          gsap.to(header, {
            yPercent: hide ? -100 : 0,
            duration: prefersReducedMotion() ? 0 : 0.7,
            ease: "power3.out",
          });
        }
      }
      lastYRef.current = y;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // While the menu is open the page behind is inert and doesn't scroll
  useEffect(() => {
    const root = document.documentElement;
    const blocked = document.querySelectorAll<HTMLElement>("[data-raven-inert]");

    if (menuOpen) {
      root.setAttribute("data-raven-menu-open", "");
      blocked.forEach((el) => {
        el.inert = true;
      });
      lenis?.stop();
    } else {
      root.removeAttribute("data-raven-menu-open");
      blocked.forEach((el) => {
        el.inert = false;
      });
      if (!stackLoaderActive()) lenis?.start();
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menuOpen && performance.now() >= menuLockRef.current) {
        menuLockRef.current = performance.now() + MENU_CLOSE_LOCK;
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [menuOpen, lenis]);

  // The menu only exists below desktop: widening the window past it closes the menu
  useEffect(() => {
    const query = window.matchMedia(DESKTOP);
    const handle = () => {
      if (!query.matches) return;
      setInstantClose(true);
      setMenuOpen(false);
    };
    query.addEventListener("change", handle);
    return () => query.removeEventListener("change", handle);
  }, []);

  // The two bars of the menu button cross into an X
  useGSAP(() => {
    const bar = barRef.current;
    if (!bar || !stackLoaderPlaying(ROUTES.home)) return;
    gsap.fromTo(bar, { yPercent: -130 }, { yPercent: 0, duration: 1.1, ease: "power3.out", delay: stackLoaderLead() + STACK_LOADER_HANDOFF - 0.7 });
  }, []);

  useGSAP(
    () => {
      const top = barTopRef.current;
      const bottom = barBottomRef.current;
      if (!top || !bottom) return;

      const duration = prefersReducedMotion() || instantClose ? 0 : 0.6;
      gsap.to(top, { yPercent: menuOpen ? 150 : 0, rotate: menuOpen ? 45 : 0, duration, ease: "power3.out" });
      gsap.to(bottom, { yPercent: menuOpen ? -150 : 0, rotate: menuOpen ? -45 : 0, duration, ease: "power3.out" });

      if (menuOpen && headerRef.current) {
        hiddenRef.current = false;
        gsap.to(headerRef.current, { yPercent: 0, duration, ease: "power3.out" });
      }
    },
    { dependencies: [menuOpen] },
  );

  useEffect(() => {
    const handleCovered = () => {
      setInstantClose(true);
      menuLockRef.current = 0;
      setMenuOpen(false);
    };
    window.addEventListener(COVERED_EVENT, handleCovered);
    return () => window.removeEventListener(COVERED_EVENT, handleCovered);
  }, []);

  useEffect(() => {
    menuLockRef.current = 0;
  }, [pathname]);

  const toggleMenu = () => {
    if (performance.now() < menuLockRef.current) return;
    menuLockRef.current = performance.now() + (menuOpen ? MENU_CLOSE_LOCK : MENU_OPEN_LOCK);
    setInstantClose(false);
    setMenuOpen((open) => !open);
  };

  const closeMenu = () => {
    if (!menuOpen) return;
    menuLockRef.current = performance.now() + MENU_CLOSE_LOCK;
    setMenuOpen(false);
  };

  const handleLogo = (event: MouseEvent<HTMLAnchorElement>) => {
    closeMenu();
    if (pathname !== ROUTES.home) return;
    event.preventDefault();
    if (lenis) lenis.scrollTo(0, { duration: 1.5 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Colours follow the menu: white over the blue panel, ink over the page
  const fade = instantClose ? "duration-0" : "duration-500";
  const solid = scrolled && !menuOpen;

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-80 transition-[background-color,color,backdrop-filter] ${fade} motion-reduce:transition-none ${
          solid ? "bg-(--raven-paper)/80 backdrop-blur-md" : "bg-transparent"
        } ${menuOpen ? "text-(color:--raven-white)" : "text-(color:--raven-ink)"}`}
      >
        <div ref={barRef} className="relative flex h-[9vh] items-center justify-between gap-5 px-[5vw] max-lg:h-[7vh] max-lg:px-[6vw] max-md:h-auto max-md:px-[7vw] max-md:py-[1.6vh]">
          <Link
            href={ROUTES.home}
            onClick={handleLogo}
            aria-label={`${BRAND.name}, home`}
            className="flex items-center py-3.5 leading-none tracking-tight"
          >
            <span className="font-raven-head text-28 font-bold">
              <BrandMark />
            </span>
          </Link>

          <NavPill pathname={pathname} />

          <div className="flex items-center gap-4 max-lg:gap-3 max-md:gap-2">
            <SoundToggle inverted={menuOpen} />
            <div className="max-md:hidden">
              <Button label="Let's talk" href={ROUTES.contact} size="sm" tone={menuOpen ? "blue" : "light"} icon />
            </div>
            <button
              ref={menuButtonRef}
              type="button"
              data-menu-toggle
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              aria-controls="raven-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className={`relative hidden aspect-square h-[5.7vh] items-center justify-center rounded-full transition-colors ${fade} motion-reduce:transition-none max-lg:flex max-md:h-[6.4vh] ${
                menuOpen ? "bg-(--raven-white) text-(color:--raven-accent)" : "bg-(--raven-ink) text-(color:--raven-paper)"
              }`}
            >
              <span aria-hidden className="flex flex-col gap-1">
                <span ref={barTopRef} className="block h-0.5 w-[2.4vw] rounded-full bg-current max-md:w-[4.4vw]" />
                <span ref={barBottomRef} className="block h-0.5 w-[2.4vw] rounded-full bg-current max-md:w-[4.4vw]" />
              </span>
            </button>
          </div>
        </div>
      </header>
      {(menuReady || menuOpen) && <Menu open={menuOpen} onClose={closeMenu} instant={instantClose} />}
    </>
  );
};

export default Header;
