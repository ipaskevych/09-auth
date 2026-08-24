import Link from 'next/link';
import AuthNavigation from '../AuthNavigation/AuthNavigation'; // Импортируем наш компонент
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
          
          {/* Добавляем ссылку на страницу создания новой заметки */}
          <li>
            <Link href="/notes/action/create" className={css.createButton || ''}>
              Create Note
            </Link>
          </li>

          {/* Вставляем компонент авторизации в самый конец списка по ТЗ */}
          <AuthNavigation />
        </ul>
      </nav>
    </header>
  );
}