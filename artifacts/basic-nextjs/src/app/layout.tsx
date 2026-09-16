import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Athletics India',
  description:
    'Expert-built workouts for athletes who want to move better and train smarter.',
  openGraph: {
    title: 'Athletics India',
    description:
      'Expert-built workouts for athletes who want to move better and train smarter.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}