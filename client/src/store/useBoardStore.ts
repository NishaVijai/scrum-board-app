import { create } from 'zustand';
import { type Card, type List } from '../types';
import { fetchTasks } from '../api';

interface BoardState {
  lists: List[];
  moveCard: (cardId: string, fromListId: string, toListId: string) => void;
  addCard: (listId: string, title: string) => void;
  removeCard: (listId: string, cardId: string) => void;
  moveList: (fromIndex: number, toIndex: number) => void;
  loadTasksFromBackend: () => Promise<void>;
}

interface BackendTask {
  id: number | string;
  title: string;
}

export const useBoardStore = create<BoardState>((set) => ({
  lists: [
    { id: 'backlog', title: 'Backlog', cards: [] },
    { id: 'todo', title: 'To Do', cards: [] },
    { id: 'inprogress', title: 'In Progress', cards: [] },
    { id: 'done', title: 'Done', cards: [] },
  ],

  moveCard: (cardId, fromListId, toListId) =>
    set((state) => {
      const fromList = state.lists.find((l) => l.id === fromListId);
      const toList = state.lists.find((l) => l.id === toListId);
      if (!fromList || !toList) return state;

      const card = fromList.cards.find((c) => c.id === cardId);
      if (!card) return state;

      fromList.cards = fromList.cards.filter((c) => c.id !== cardId);
      toList.cards.push(card);

      return { lists: [...state.lists] };
    }),

  addCard: (listId, title) =>
    set((state) => {
      const list = state.lists.find((l) => l.id === listId);
      if (!list) return state;
      const newCard: Card = { id: Date.now().toString(), title };
      list.cards.push(newCard);
      return { lists: [...state.lists] };
    }),

  removeCard: (listId, cardId) =>
    set((state) => {
      const list = state.lists.find((l) => l.id === listId);
      if (!list) return state;
      list.cards = list.cards.filter((c) => c.id !== cardId);
      return { lists: [...state.lists] };
    }),

  moveList: (fromIndex, toIndex) =>
    set((state) => {
      const updatedLists = Array.from(state.lists);
      const [movedList] = updatedLists.splice(fromIndex, 1);
      updatedLists.splice(toIndex, 0, movedList);
      return { lists: updatedLists };
    }),

  loadTasksFromBackend: async () => {
    try {
      const tasks: BackendTask[] = await fetchTasks();
      set((state) => {
        const updatedLists = state.lists.map((list) =>
          list.id === 'backlog'
            ? {
              ...list,
              cards: tasks.map((t) => ({
                id: t.id.toString(),
                title: t.title,
              })),
            }
            : list
        );
        return { lists: updatedLists };
      });
    } catch (error) {
      console.error("Failed to load tasks from backend", error);
    }
  },
}));
