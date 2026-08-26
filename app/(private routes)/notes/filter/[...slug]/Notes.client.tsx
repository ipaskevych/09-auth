'use client';

import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { fetchNotes } from '@/lib/api/clientApi';
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
  const perPage = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, perPage, tag, debouncedSearch],
    queryFn: () => fetchNotes({ page, perPage, tag, search: debouncedSearch }),
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

        {/* Безопасно извлекаем массив заметок и считаем количество страниц */}
        {(() => {
          const notesArray = Array.isArray(data) ? data : (data as any)?.notes || [];
          const totalNotes = Array.isArray(data) ? data.length : (data as any)?.totalCount || (data as any)?.total || 0;
          const pageCount = Math.ceil(totalNotes / perPage) || 1;

          return (
            <>
              {notesArray.length > 0 && (
                <Pagination
                  pageCount={pageCount}
                  forcePage={page - 1}
                  onPageChange={(selectedItem) => setPage(selectedItem.selected + 1)}
                />
              )}

              {/* Список заметок рендерится только при наличии элементов */}
              {notesArray.length > 0 && <NoteList notes={notesArray} />}
            </>
          );
        })()}

      </div>
    </div>
  );
}