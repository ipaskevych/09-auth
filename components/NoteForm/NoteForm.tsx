'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createNote } from '@/lib/api/clientApi';
import { useNoteStore } from '@/lib/store/noteStore';
import { NewNote, Note } from '@/types/note';
import css from './NoteForm.module.css';

export default function NoteForm() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Достаем актуальные названия функций из нашего обновленного Zustand-стора
  const { draft, setDraft, clearDraft } = useNoteStore();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      // Инвалидируем кэш заметок для TanStack Query
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      // Очищаем черновик в Zustand и localStorage после успешного создания
      clearDraft();
      // Перенаправляем пользователя на страницу всех заметок
      router.push('/notes/filter/all');
    },
  });

  // Правильный обработчик изменения полей (передаем объект с обновленным полем)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDraft({ [name]: value });
  };

  // Обработчик отправки формы
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  mutation.mutate({
    ...draft,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as Omit<Note, 'id'>);
};

  // По ТЗ кнопка отмены должна возвращать пользователя назад, не очищая черновик
  const handleCancel = () => {
    router.back();
  };

  return (
    <form onSubmit={handleSubmit} className={css.form || ''}>
      {/* Поле Title */}
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          value={draft.title}
          onChange={handleChange}
          required
        />
      </div>

      {/* Поле Content */}
      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          className={css.textarea}
          value={draft.content}
          onChange={handleChange}
        />
      </div>

      {/* Поле Tag */}
      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={handleChange}
          required
        >
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Shopping">Shopping</option>
          <option value="Todo">Todo</option>
          <option value="Meeting">Meeting</option>
        </select>
      </div>

      {/* Кнопки действий */}
      <div className={css.actions}>
        <button
          type="button"
          onClick={handleCancel}
          className={css.cancelButton}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={mutation.isPending}
          className={css.submitButton}
        >
          {mutation.isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
}