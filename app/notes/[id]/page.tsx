import { Metadata } from 'next';
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from './NoteDetails.client';

interface Props {
  params: Promise<{ id: string }>;
}

// --- НАЧАЛО БЛОКА ДИНАМИЧЕСКИХ МЕТАДАННЫХ ПО ТЗ ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);

    const description = note.content && note.content.length > 150
      ? `${note.content.slice(0, 150)}...`
      : note.content || 'Перегляд нотатки';

    return {
      title: `${note.title} | NoteHub`,
      description: description,
      openGraph: {
        title: `${note.title} | NoteHub`,
        description: description,
        url: `https://08-zustand-nu-navy.vercel.app/notes/${note.id}`,
        siteName: 'NoteHub',
        locale: 'uk_UA',
        type: 'article',
        images: [
          {
            url: `https://ac.goit.global/fullstack/react/notehub-og-meta.jpg`,
            width: 1200,
            height: 630,
            alt: note.title,
          },
        ],
      },
    };
  } catch (error) {
    return {
      title: 'Нотатка | NoteHub',
      description: 'Перегляд нотатки',
    };
  }
}
// --- КОНЕЦ БЛОКА ДИНАМИЧЕСКИХ МЕТАДАННЫХ ---

export default async function NoteDetailsPage({ params }: Props) {
  // Требование ментора: ожидаем (await) параметры в теле функции
  const { id } = await params;

  const queryClient = new QueryClient();

  // Делаем prefetch конкретной заметки на сервере по полученному id
  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}