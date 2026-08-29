import Link from 'next/link';
import AuthNavigation from '@/components/AuthNavigation/AuthNavigation'; 
import css from './Header.module.css';

export default function Header() {
  return (
    <header className={css.header}>
      {/* 1. Левая часть: Логотип */}
      <Link href="/" aria-label="Home" className={css.logo}>
        NoteHub
      </Link>

      {/* 2. Центральная часть: Кнопка создания заметки */}
      <div className={css.headerCenter}>
        <Link href="/notes/action/create" className={css.createButton}>
          Create Note
        </Link>
      </div>

      {/* 3. Правая часть: Меню навигации */}
      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/notes/filter/all">Notes</Link>
          </li>
          {/* Компонент AuthNavigation со ссылками Login / Sign up */}
          <AuthNavigation />
        </ul>
      </nav>
    </header>
  );
}