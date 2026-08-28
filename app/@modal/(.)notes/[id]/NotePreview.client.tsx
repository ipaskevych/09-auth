'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { clientApi } from '@/lib/api/clientApi'; // Исправили импорт на клиентский API по ТЗ 9
import Modal from '@/components/Modal/Modal';

interface Props {
  id: string;
}
export default function NoteDetailsModalClient({ id }: Props) {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    // Добавили clientApi. перед вызовом функции
    queryFn: () => clientApi.fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back(); // Возврат назад при закрытии модалки
  };

  if (isLoading) {
    return (
      <Modal isOpen={true} onClose={handleClose}>
        <div style={{ padding: '30px', textAlign: 'center' }}>Loading note details...</div>
      </Modal>
    );
  }

  if (isError || !data) {
    return (
      <Modal isOpen={true} onClose={handleClose}>
        <div style={{ padding: '30px', textAlign: 'center', color: 'red' }}>
          Error loading note details. Please try again.
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={true} onClose={handleClose}>
      <div style={{ padding: '30px', minWidth: '350px', position: 'relative' }}>
        {/* Кнопка закрытия для ментора */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            right: '15px',
            top: '15px',
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>

        <h2 style={{ fontSize: '24px', marginBottom: '10px', color: '#111' }}>
          {data.title || 'No Title'}
        </h2>
        <p style={{ color: '#555', lineHeight: '1.5', marginBottom: '15px' }}>
          {data.content}
        </p>
        {data.tag && (
          <span style={{
            background: '#e0f2fe',
            color: '#0369a1',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {data.tag}
          </span>
        )}
      </div>
    </Modal>
  );
}