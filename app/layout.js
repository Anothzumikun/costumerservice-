import './globals.css';

export const metadata = {
  title: 'Customer Service',
  description: 'Customer service chat'
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
