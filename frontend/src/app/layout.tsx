import React from 'react';
import '../styles/globals.css';

export const metadata = {
  title: 'VisionRoot — Service Request Management System',
  description: 'Internal Service Request Management System for VisionRoot',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
