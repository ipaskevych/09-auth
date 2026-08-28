import Link from 'next/link';
import AuthNavigation from '@/components/AuthNavigation/AuthNavigation'; // Добавили импорт нашей авторизации
import css from './Header.module.css';

export default function Header() {
  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home" className={css.logo}>
        NoteHub
      </Link>
      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/notes/filter/all">Notes</Link>
          </li>
          {/* Ссылка на страницу создания новой заметки */}
          <li>
            <Link href="/notes/action/create" className={css.createButton || ''}>
              Create Note
            </Link>
          </li>
          {/* ТЗ: Добавляем в конец списка компонент AuthNavigation со ссылками на новые страницы */}
          <AuthNavigation />
        </ul>
      </nav>
    </header>
  );
}