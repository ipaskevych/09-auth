import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import AuthProvider from '@/components/AuthProvider/AuthProvider'; // Добавили импорт провайдера авторизации
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

// 1. Подключаем шрифт Roboto с нужными начертаниями и подмножествами
const roboto = Roboto({
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-roboto',
  display: 'swap',
});

// 2. Настраиваем расширенные статические метаданные по ТЗ
export const metadata: Metadata = {
  title: 'NoteHub — Ваші нотатки',
  description: 'Efficient application for managing personal notes',
  openGraph: {
    title: 'NoteHub — Ваші нотатки',
    description: 'Efficient application for managing personal notes',
    url: 'https://notehub.com',
    siteName: 'NoteHub',
    images: [
      {
        url: 'https://goit.global',
        width: 1200,
        height: 630,
        alt: 'NoteHub Preview Image',
      },
    ],
    locale: 'uk_UA',
    type: 'website',
  },
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="uk">
      {/* 3. Применяем класс шрифта к тегу body */}
      <body className={roboto.className}>
        <TanStackProvider>
          {/* AuthProvider по ТЗ вложен внутрь TanStackProvider и оборачивает весь контент приложения */}
          <AuthProvider>
            {/* Верхнее меню навигации (шапка сайта) */}
            <Header />

            {/* Основной контент страниц приложения */}
            <main>{children}</main>

            {/* Слот для перехватывающих модальных окон деталей заметки */}
            {modal}

            {/* Подвал сайта */}
            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}