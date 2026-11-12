import React from 'react';

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
      <body style={{ fontFamily: 'system-ui, -apple-system, sans-serif', margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}

