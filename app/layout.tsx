import dynamic from "next/dynamic";
import "./globals.css";
import "./raven-styles.css";
import type { ReactNode } from "react";
import { Instrument_Serif, Schibsted_Grotesk } from "next/font/google";
import PageTransition from "./components/effects/page-transition";
import AgentTools from "./components/shared/AgentTools";
import DeferredEffects from "./components/shared/DeferredEffects";
import Header from "./components/shared/Header";
import ScrollTopOnLoad from "./components/shared/ScrollTopOnLoad";
import SiteMarker from "./components/shared/SiteMarker";

const Footer = dynamic(() => import("./components/shared/Footer"));
const FooterCta = dynamic(() => import("./components/shared/FooterCta"));

// One family for headings and body text. It's variable (400 to 900): the footer wordmark
// animates its weight axis. Only the upright style is loaded: every italic on the site is the
// Instrument Serif accent below, so a Schibsted italic file would be downloaded and never used.
// Only the latin subset is preloaded; the latin-ext face is still declared and loads on demand
// if a page ever uses one of its characters.
const ravenFont = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: "variable",
  style: ["normal"],
  variable: "--font-raven-head",
  display: "swap",
});

// Italic serif for accent words inside headlines (the .raven-accent class)
const accentFont = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
  variable: "--font-raven-serif",
  display: "swap",
});

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <div className={`raven-page relative ${ravenFont.variable} ${accentFont.variable}`}>
          <SiteMarker name="data-raven-site" />
          <PageTransition />
          <ScrollTopOnLoad />
          <DeferredEffects />
          <AgentTools />
          <Header />
          <main data-raven-inert className="relative z-2 rounded-b-3xl bg-(--raven-paper)">
            {children}
            <div data-raven-chrome className="contents">
              <FooterCta />
            </div>
          </main>
          <div data-raven-chrome className="contents">
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
};

export default layout;
