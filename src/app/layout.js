import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'CounselSphere - College Admission Counselling',
  description: 'Online college admission counselling, seat matrix status, branch allotment and verification system.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {/* Global Ambient Background Glows */}
          <div className="bg-glow-container" />
          
          {/* Main Layout Wrappers */}
          <div className="app-layout">
            <Navbar />
            <main className="main-content">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>

        <style dangerouslySetInnerHTML={{ __html: `
          .app-layout {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }
          .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
          }
        ` }} />
      </body>
    </html>
  );
}
