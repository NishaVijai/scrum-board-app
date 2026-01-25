import { create } from 'zustand';
import { type Card, type List } from '../types';
import {
  createTask,
  updateTask,
  deleteTask,
  updateColumnsOrder,
  fetchTasks,
  pingHealth,
  type TaskDto,
} from '../api';

interface BoardState {
  lists: List[];
  isLoading: boolean;
  hasColdStartDelay: boolean;
  error: string | null;

  addCard: (listId: string, title: string) => Promise<void>;
  updateCardTitle: (cardId: string, title: string) => Promise<void>;
  updateCardDescription: (cardId: string, description: string) => Promise<void>;
  moveCard: (
    cardId: string,
    fromListId: string,
    toListId: string,
    targetIndex?: number
  ) => Promise<void>;
  removeCard: (cardId: string) => Promise<void>;
  moveList: (fromIndex: number, toIndex: number) => Promise<void>;
  loadTasksFromBackend: () => Promise<void>;
  warmUpBackend: () => Promise<void>;
}

const COLUMN_MAP: Record<string, number> = {
  backlog: 0,
  todo: 1,
  inprogress: 2,
  done: 3,
};

const COLUMN_TO_LIST: Record<number, string> = {
  0: 'backlog',
  1: 'todo',
  2: 'inprogress',
  3: 'done',
};

export const useBoardStore = create<BoardState>((set, get) => ({
  lists: [
    { id: 'backlog', title: 'Backlog', cards: [] },
    { id: 'todo', title: 'To Do', cards: [] },
    { id: 'inprogress', title: 'In Progress', cards: [] },
    { id: 'done', title: 'Done', cards: [] },
  ],
  isLoading: false,
  hasColdStartDelay: false,
  error: null,

  // -----------------------
  // Warm backend
  // -----------------------
  warmUpBackend: async () => {
    set({ hasColdStartDelay: true });
    try {
      await pingHealth();
      await get().loadTasksFromBackend();
    } catch {
      set({ error: 'Failed to load tasks.' });
    } finally {
      set({ hasColdStartDelay: false });
    }
  },

  // -----------------------
  // Load tasks
  // -----------------------
  loadTasksFromBackend: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks: TaskDto[] = await fetchTasks();

      const cardsByList: Record<string, Card[]> = {
        backlog: [],
        todo: [],
        inprogress: [],
        done: [],
      };

      tasks.forEach((task) => {
        const listId = COLUMN_TO_LIST[task.column] ?? 'backlog';
        cardsByList[listId].push({
          id: task.id,
          title: task.title,
          description: task.description ?? '',
          row: task.row,
        });
      });

      Object.values(cardsByList).forEach((cards) =>
        cards.sort((a, b) => a.row - b.row)
      );

      set({
        lists: [
          { id: 'backlog', title: 'Backlog', cards: cardsByList.backlog },
          { id: 'todo', title: 'To Do', cards: cardsByList.todo },
          { id: 'inprogress', title: 'In Progress', cards: cardsByList.inprogress },
          { id: 'done', title: 'Done', cards: cardsByList.done },
        ],
      });
    } catch {
      set({ error: 'Failed to load tasks. Please try again.' });
    } finally {
      set({ isLoading: false });
    }
  },

  // -----------------------
  // Card actions
  // -----------------------
  addCard: async (listId, title) => {
    const column = COLUMN_MAP[listId] ?? 0;
    const row = get().lists.find((l) => l.id === listId)?.cards.length ?? 0;

    await createTask(title, column, row);
    await get().loadTasksFromBackend();
  },

  updateCardTitle: async (cardId, title) => {
    const list = get().lists.find((l) => l.cards.some((c) => c.id === cardId));
    if (!list) return;
    const card = list.cards.find((c) => c.id === cardId);
    if (!card) return;

    await updateTask({
      id: cardId,
      title,
      description: card.description,
      column: COLUMN_MAP[list.id],
      row: card.row,
    });

    await get().loadTasksFromBackend();
  },

  updateCardDescription: async (cardId, description) => {
    const list = get().lists.find((l) => l.cards.some((c) => c.id === cardId));
    if (!list) return;
    const card = list.cards.find((c) => c.id === cardId);
    if (!card) return;

    await updateTask({
      id: cardId,
      title: card.title,
      description,
      column: COLUMN_MAP[list.id],
      row: card.row,
    });

    await get().loadTasksFromBackend();
  },

  // -----------------------
  // ✅ FIXED MOVE CARD
  // -----------------------
  moveCard: async (cardId, fromListId, toListId, targetIndex) => {
    // Optimistic UI update
    set((state) => {
      const from = state.lists.find((l) => l.id === fromListId);
      const to = state.lists.find((l) => l.id === toListId);
      if (!from || !to) return state;

      const cardIndex = from.cards.findIndex((c) => c.id === cardId);
      if (cardIndex === -1) return state;

      const [card] = from.cards.splice(cardIndex, 1);
      const insertIndex = targetIndex ?? to.cards.length;
      to.cards.splice(insertIndex, 0, card);

      return { lists: [...state.lists] };
    });

    // Persist changes safely (no reload, no sequential fetch spam)
    const affectedLists =
      fromListId === toListId ? [fromListId] : [fromListId, toListId];

    await Promise.allSettled(
      affectedLists.flatMap((listId) => {
        const list = get().lists.find((l) => l.id === listId);
        if (!list) return [];

        return list.cards.map((c, index) =>
          updateTask({
            id: c.id,
            title: c.title,
            description: c.description,
            column: COLUMN_MAP[listId],
            row: index,
          })
        );
      })
    );
  },

  removeCard: async (cardId) => {
    await deleteTask(cardId);
    await get().loadTasksFromBackend();
  },

  // -----------------------
  // List ordering
  // -----------------------
  moveList: async (fromIndex, toIndex) => {
    set((state) => {
      const updated = [...state.lists];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return { lists: updated };
    });

    await updateColumnsOrder(get().lists.map((l) => l.id));
  },
}));
