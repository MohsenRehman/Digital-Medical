import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import { PatientAuthProvider } from "./context/PatientAuthContext";
import { ClinicAuthProvider } from "./context/ClinicAuthContext";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});


export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0f4ff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1426" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Health & Digital Medical | Caring for Health, Caring for You",
  description:
    "Find top-rated certified doctors, schedule clinic visits, and explore accredited healthcare specialties with our 24/7 digital medical ecosystem.",
  keywords: [
    "Doctors",
    "Digital Clinic",
    "Top-Rated Doctors",
    "Cardiologist",
    "Pediatrician",
    "Telehealth",
    "Medical Appointments",
    "Healthcare Services",
    "Emergency Clinic",
  ],
  authors: [{ name: "Digital Medical Healthcare Network" }],
  creator: "Digital Medical",
  publisher: "Digital Medical",
  metadataBase: new URL("https://digital-clinic-ui.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Digital Medical | Caring for Health, Caring for You",
    description:
      "Find top-rated certified doctors, schedule clinic visits, and explore accredited healthcare specialties.",
    url: "https://digital-clinic-ui.vercel.app",
    siteName: "Digital Medical Clinic",
    images: [
      {
        url: "/images/hero-doctors.png",
        width: 800,
        height: 600,
        alt: "Senior Healthcare Doctors Team",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Medical | Caring for Health, Caring for You",
    description:
      "Find top-rated certified doctors, schedule clinic visits, and access 24/7 digital medical care.",
    images: ["/images/hero-doctors.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "name": "Digital Medical Clinic",
    "image": "https://digital-clinic-ui.vercel.app/images/hero-doctors.png",
    "description": "Comprehensive digital healthcare clinic connecting patients with certified physicians.",
    "telephone": "+1-800-689-2500",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Mercy Doctor Hospital Plaza, Suite 400",
      "addressLocality": "United States",
      "addressCountry": "US"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      }
    ],
    "medicalSpecialty": [
      "Cardiovascular",
      "Pediatric",
      "Pulmonary",
      "Neurologic"
    ]
  };

  return (
    <html lang="en" className={`scroll-smooth ${jakartaSans.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen relative selection:bg-sky-500 selection:text-white font-body">
        <ThemeProvider>
          <PatientAuthProvider>
            <ClinicAuthProvider>{children}</ClinicAuthProvider>
          </PatientAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
