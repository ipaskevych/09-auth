import type { Metadata } from 'next';
import css from './page.module.css';

// Добавляем метаданные для страницы 404 по ТЗ
export const metadata: Metadata = {
  title: '404 - Page not found | NoteHub',
  description: 'Повідомлення про відсутність сторінки',
};

export default function NotFound() {
  return (
    <>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>Sorry, the page you are looking for does not exist.</p>
    </>
  );
}