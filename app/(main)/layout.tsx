import ClientLayout from '../components/ClientLayout';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}