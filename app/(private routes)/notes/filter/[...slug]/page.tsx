import { Metadata } from 'next';
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { serverApi } from '@/lib/api/serverApi'; // Исправили импорт на серверный API по ТЗ 9
import NotesClient from './Notes.client';

interface Props {
  params: Promise<{
    slug?: string[];
  }>;
}

// --- НАЧАЛО БЛОКА ДИНАМИЧЕСКИХ МЕТАДАННЫХ ПО ТЗ ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slugArray = resolvedParams?.slug || [];
  
  // Достаем тег из урла, если его нет или это 'all' — ставим дефолтное название
  const rawTag = slugArray.length > 0 ? slugArray[0] : '';
  const isAll = !rawTag || rawTag.toLowerCase() === 'all';
  
  // Формируем красивое имя фильтра (с большой буквы), например: "Work", "Personal" или "All"
  const filterName = isAll ? 'All' : rawTag.charAt(0).toUpperCase() + rawTag.slice(1);

  return {
    title: `Фільтр: ${filterName} | NoteHub`,
    description: `Перегляд нотаток за категорією ${filterName}`,
    openGraph: {
      title: `Фільтр: ${filterName} | NoteHub`,
      description: `Перегляд нотаток за категорією ${filterName}`,
      url: `https://08-zustand-nu-navy.vercel.app/${isAll ? 'all' : rawTag.toLowerCase()}`,
      siteName: 'NoteHub',
      images: [
        {
          url: `https://ac.goit.global/fullstack/react/notehub-og-meta.jpg`,
          width: 1200,
          height: 630,
          alt: `NoteHub Filter ${filterName} Preview`,
        },
      ],
      locale: 'uk_UA',
      type: 'website',
    },
  };
}
// --- КОНЕЦ БЛОКА ДИНАМИЧЕСКИХ МЕТАДАННЫХ ---

export default async function NotesPage({ params }: Props) {
  const resolvedParams = await params;
  const slugArray = resolvedParams?.slug || [];
  
  const rawTag = slugArray.length > 0 ? slugArray[0] : '';
  const tagParam = (!rawTag || rawTag.toLowerCase() === 'all') ? '' : rawTag;

  const queryClient = new QueryClient();

  // Исправлено: Вызываем serverApi и передаем параметры объектом по ТЗ 9
  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, tagParam, ''],
    queryFn: () => serverApi.fetchNotes({ page: 1, tag: tagParam, search: '' }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tagParam} />
    </HydrationBoundary>
  );
}