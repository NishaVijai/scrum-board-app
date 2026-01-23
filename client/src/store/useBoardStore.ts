import { create } from 'zustand';
import { type Card, type List } from '../types';
import {
  createTask,
  updateTask,
  deleteTask,
  updateColumnsOrder,
  fetchTasks,
} from '../api';

interface BoardState {
  lists: List[];
  isLoading: boolean;
  hasColdStartDelay: boolean;
  error: string | null;

  addCard: (listId: string, title: string) => Promise<void>;
  updateCardTitle: (cardId: string, title: string) => Promise<void>;
  updateCardDescription: (
    cardId: string,
    description: string
  ) => Promise<void>;
  moveCard: (
    cardId: string,
    fromListId: string,
    toListId: string
  ) => Promise<void>;
  removeCard: (cardId: string) => Promise<void>;
  moveList: (fromIndex: number, toIndex: number) => Promise<void>;
  loadTasksFromBackend: () => Promise<void>;
  setLists: (lists: List[]) => void;
}

interface BackendTask {
  id: string;
  title: string;
  description?: string | null;
  column: number;
  row: number;
}

export const useBoardStore = create<BoardState>((set, get) => {
  const loadListsFromStorage = (): List[] => {
    const saved = localStorage.getItem('boardLists');
    return saved
      ? JSON.parse(saved)
      : [
        { id: 'backlog', title: 'Backlog', cards: [] },
        { id: 'todo', title: 'To Do', cards: [] },
        { id: 'inprogress', title: 'In Progress', cards: [] },
        { id: 'done', title: 'Done', cards: [] },
      ];
  };

  return {
    lists: loadListsFromStorage(),
    isLoading: false,
    hasColdStartDelay: false,
    error: null,

    setLists: (lists) => {
      localStorage.setItem('boardLists', JSON.stringify(lists));
      set({ lists });
    },

    loadTasksFromBackend: async () => {
      set({
        isLoading: true,
        hasColdStartDelay: false,
        error: null,
      });

      const coldStartTimer = setTimeout(() => {
        set({ hasColdStartDelay: true });
      }, 3000);

      try {
        const tasks: BackendTask[] = await fetchTasks();

        const columnToListId: Record<number, string> = {
          0: 'backlog',
          1: 'todo',
          2: 'inprogress',
          3: 'done',
        };

        const cardsByList: Record<string, Card[]> = {
          backlog: [],
          todo: [],
          inprogress: [],
          done: [],
        };

        tasks.forEach((task) => {
          const listId = columnToListId[task.column] ?? 'backlog';
          cardsByList[listId].push({
            id: task.id,
            title: task.title,
            row: task.row,
            description: task.description ?? '',
          });
        });

        Object.values(cardsByList).forEach((cards) =>
          cards.sort((a, b) => a.row - b.row)
        );

        const updatedLists: List[] = [
          { id: 'backlog', title: 'Backlog', cards: cardsByList.backlog },
          { id: 'todo', title: 'To Do', cards: cardsByList.todo },
          {
            id: 'inprogress',
            title: 'In Progress',
            cards: cardsByList.inprogress,
          },
          { id: 'done', title: 'Done', cards: cardsByList.done },
        ];

        set({ lists: updatedLists });
        localStorage.setItem('boardLists', JSON.stringify(updatedLists));
      } catch (err) {
        console.error(err);
        set({ error: 'Failed to load tasks. Please try again.' });
      } finally {
        clearTimeout(coldStartTimer);
        set({ isLoading: false });
      }
    },

    addCard: async (listId, title) => {
      const columnMap: Record<string, number> = {
        backlog: 0,
        todo: 1,
        inprogress: 2,
        done: 3,
      };

      const column = columnMap[listId] ?? 0;
      const row = get().lists.find((l) => l.id === listId)?.cards.length ?? 0;

      await createTask(title, column, row);
      await get().loadTasksFromBackend();
    },

    updateCardTitle: async (cardId, title) => {
      const tasks = await fetchTasks();
      const task = tasks.find((t) => t.id === cardId);
      if (!task) return;

      await updateTask({ ...task, title });
      await get().loadTasksFromBackend();
    },

    updateCardDescription: async (cardId, description) => {
      const tasks = await fetchTasks();
      const task = tasks.find((t) => t.id === cardId);
      if (!task) return;

      await updateTask({ ...task, description });
      await get().loadTasksFromBackend();
    },

    moveCard: async (cardId, fromListId, toListId) => {
      const columnMap: Record<string, number> = {
        backlog: 0,
        todo: 1,
        inprogress: 2,
        done: 3,
      };

      set((state) => {
        const from = state.lists.find((l) => l.id === fromListId);
        const to = state.lists.find((l) => l.id === toListId);
        if (!from || !to) return state;

        const card = from.cards.find((c) => c.id === cardId);
        if (!card) return state;

        from.cards = from.cards.filter((c) => c.id !== cardId);
        to.cards.push(card);

        return { lists: [...state.lists] };
      });

      for (const listId of [fromListId, toListId]) {
        const list = get().lists.find((l) => l.id === listId);
        if (!list) continue;

        for (let i = 0; i < list.cards.length; i++) {
          const c = list.cards[i];
          await updateTask({
            id: c.id,
            title: c.title,
            description: c.description,
            column: columnMap[listId],
            row: i,
          });
        }
      }

      await get().loadTasksFromBackend();
    },

    removeCard: async (cardId) => {
      await deleteTask(cardId);
      await get().loadTasksFromBackend();
    },

    moveList: async (fromIndex, toIndex) => {
      set((state) => {
        const updated = [...state.lists];
        const [moved] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, moved);
        localStorage.setItem('boardLists', JSON.stringify(updated));
        return { lists: updated };
      });

      await updateColumnsOrder(get().lists.map((l) => l.id));
    },
  };
});
