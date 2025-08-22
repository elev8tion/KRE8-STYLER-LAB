import type { Metadata } from "next";
import { Inter, Orbitron, Fira_Code } from "next/font/google";
import StyledComponentsRegistry from "@/lib/styled-components-registry";
import HolographicBackground from "@/components/HolographicBackground";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

const orbitron = Orbitron({ 
  subsets: ["latin"],
  variable: '--font-orbitron'
});

const firaCode = Fira_Code({ 
  subsets: ["latin"],
  variable: '--font-fira-code'
});

export const metadata: Metadata = {
  title: "The Lab - KRE8-Styler",
  description: "Holographic AI Command Center - Where KRE8tivity Meets Intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body 
        className={`${inter.variable} ${orbitron.variable} ${firaCode.variable} font-sans bg-black text-gray-100 antialiased`}
        suppressHydrationWarning={true}
      >
        <StyledComponentsRegistry>
          <HolographicBackground />
          <div className="relative z-10">
            {children}
          </div>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
