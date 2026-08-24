'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '@/lib/api/clientApi';
import type { Note } from '@/types/note'; // Исправили путь импорта типа
import Link from 'next/link'; // Добавили Link для Next.js
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  // Мутация удаления и автоматическое обновление списка
  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  return (
    <ul className={css.list}>
      {notes?.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h3 className={css.title}>{note.title}</h3>
          <p className={css.content}>{note.content}</p>

          {/* Обёртка футера карточки для правильного позиционирования */}
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginLeft: 'auto' }}>
              {/* Требование Скриншота 8 - Ссылка на детали */}
              <Link 
  href={`/notes/${note.id}`} 
  className={css.link} 
  style={{ color: '#ffffff', textDecoration: 'none' }}
>
  View details
</Link>

              <button
                onClick={() => mutation.mutate(note.id)}
                disabled={mutation.isPending}
                className={css.button} // Твоя оригинальная красная кнопка
              >
                {mutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}