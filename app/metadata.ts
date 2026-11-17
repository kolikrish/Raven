
import type { Metadata } from "next";
import ogImage from "./assets/pictures/shared/og-image.jpg";

// Your live domain. Used for canonical URLs and to resolve social preview
// images - change it before deploying.
export const SITE_URL = "https://example.com";

export const pageMetadata = (
  title: string,
  description: string,
  path = "",
): Metadata => ({
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: {
    canonical: `${SITE_URL}${path}`,
  },
  openGraph: {
    title,
    description,
    images: [{ url: ogImage.src, width: ogImage.width, height: ogImage.height }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage.src],
  },
});
