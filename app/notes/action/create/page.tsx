import { Metadata } from 'next';
import NoteForm from '@/components/NoteForm/NoteForm';
import css from './CreateNote.module.css'; // Импортируем стили оформления страницы

export const metadata: Metadata = {
  title: 'Create New Note | NoteHub',
  description: 'Сторінка для створення нової нотатки у застосунку NoteHub',
  openGraph: {
    title: 'Create New Note | NoteHub',
    description: 'Сторінка для створення нової нотатки у застосунку NoteHub',
    url:`https://08-zustand-nu-navy.vercel.app/notes/action/create`,
    images: [
      {
        url: `https://ac.goit.global/fullstack/react/notehub-og-meta.jpg`,
        width: 1200,
        height: 630,
        alt: 'NoteHub Preview Image',
      },
    ],
  },
};

export default function CreateNotePage() {
  return (
    <main className={css.page}>
      <div className={css.container}>
        <h1 className={css.title}>Create a New Note</h1>
        <NoteForm />
      </div>
    </main>
  );
}