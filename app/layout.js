import './globals.css';

export const metadata = {
  title: 'Product & Service Review | Private employee feedback',
  description: 'A private customer feedback platform for businesses, with employee-specific review links for NFC cards, QR codes, and direct links.',
};

export default function RootLayout({ children }) {
  return <html lang="en" data-scroll-behavior="smooth"><body>{children}</body></html>;
}
