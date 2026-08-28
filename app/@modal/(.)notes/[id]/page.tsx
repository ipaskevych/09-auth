import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { serverApi } from '@/lib/api/serverApi'; // Исправили импорт на серверный API по ТЗ 9
import NotePreviewClient from './NotePreview.client'; 

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function NoteDetailsModalPage({ params }: Props) {
  const { id } = await params;
  const queryClient = new QueryClient();

  // Исправлено: Вызываем serverApi перед функцией prefetch на сервере
  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => serverApi.fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* Исправили название компонента здесь */}
      <NotePreviewClient id={id} />
    </HydrationBoundary>
  );
}