import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DraftNote {
  title: string;
  content: string;
  tag: 'Work' | 'Personal' | 'Shopping' | 'Todo' | 'Meeting';
}

interface NoteState {
  draft: DraftNote;
  setDraft: (note: Partial<DraftNote>) => void;
  clearDraft: () => void;
}

const initialDraft: DraftNote = {
  title: '',
  content: '',
  tag: 'Todo',
};

export const useNoteStore = create<NoteState>()(
  persist(
    (set) => ({
      draft: initialDraft,

      setDraft: (updatedFields) =>
        set((state) => ({
          draft: {
            ...state.draft,
            ...updatedFields,
          },
        })),

      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: 'note-hub-draft',
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);