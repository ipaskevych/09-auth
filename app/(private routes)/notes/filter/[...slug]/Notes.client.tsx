'use client';

import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { clientApi } from '@/lib/api/clientApi'; // Исправили импорт на клиентский API по ТЗ 9
import SearchBox from '@/components/SearchBox/SearchBox';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import Link from 'next/link';
import pageCss from './NotesPage.module.css';

interface NotesClientProps {
  tag: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, tag, debouncedSearch],
    // Передаем параметры объектом в соответствии с новым методом clientApi
    queryFn: () => clientApi.fetchNotes({ page, tag, search: debouncedSearch }),
    placeholderData: keepPreviousData,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError) return <p>Something went wrong. Could not load notes.</p>;

  return (
    <div className={pageCss.main}>
      <div className={pageCss.container}>
        
        {/* Верхняя панель управления */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '60px', marginBottom: '40px', width: '100%', gap: '20px' }}>
          <SearchBox value={search} onChange={(val) => { setSearch(val); setPage(1); }} />

          <Link href="/notes/action/create" className={pageCss.createButton}>
            Create Note
          </Link>
        </div>
        
        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            forcePage={page - 1}
            onPageChange={(selectedItem) => setPage(selectedItem.selected + 1)}
          />
        )}
      </div>

      {/* Список заметок */}
      {data && <NoteList notes={data.notes} />}
        
    </div>
  );
}