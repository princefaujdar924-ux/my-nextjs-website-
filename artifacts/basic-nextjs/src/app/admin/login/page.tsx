import type { Metadata } from 'next';
import AdminLoginPage from './admin-login-page';

export const metadata: Metadata = {
  title: 'Admin Login | Athletics India',
  description: 'Secure administrator sign in for Athletics India.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginRoute() {
  return <AdminLoginPage />;
}