import { create } from 'zustand';
import { type Card, type List } from '../types';
import { fetchTasks, createTask, updateTask, deleteTask } from '../api';

interface BoardState {
  lists: List[];
  moveCard: (cardId: string, fromListId: string, toListId: string) => Promise<void>;
  addCard: (listId: string, title: string) => Promise<void>;
  removeCard: (listId: string, cardId: string) => Promise<void>;
  moveList: (fromIndex: number, toIndex: number) => void;
  loadTasksFromBackend: () => Promise<void>;
}

interface BackendTask {
  id: number | string;
  title: string;
  description?: string | null;
  column: number;
  row: number;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  lists: [
    { id: 'backlog', title: 'Backlog', cards: [] },
    { id: 'todo', title: 'To Do', cards: [] },
    { id: 'inprogress', title: 'In Progress', cards: [] },
    { id: 'done', title: 'Done', cards: [] },
  ],

  moveCard: async (cardId, fromListId, toListId) => {
    set((state) => {
      const fromList = state.lists.find((l) => l.id === fromListId);
      const toList = state.lists.find((l) => l.id === toListId);
      if (!fromList || !toList) return state;

      const card = fromList.cards.find((c) => c.id === cardId);
      if (!card) return state;

      fromList.cards = fromList.cards.filter((c) => c.id !== cardId);
      toList.cards.push(card);

      return { lists: [...state.lists] };
    });

    try {
      const state = get();

      const toList = state.lists.find((l) => l.id === toListId);
      if (!toList) throw new Error("Destination list not found");

      const columnMap: Record<string, number> = {
        backlog: 0,
        todo: 1,
        inprogress: 2,
        done: 3,
      };
      const column = columnMap[toListId] ?? 0;

      const row = toList.cards.findIndex((c) => c.id === cardId);
      if (row === -1) throw new Error("Card not found in destination list");

      const card = toList.cards.find((c) => c.id === cardId);
      if (!card) throw new Error("Card not found for update");

      await updateTask({
        id: parseInt(card.id),
        title: card.title,
        column,
        row,
      });
    } catch (error) {
      console.error("Failed to sync moved card with backend", error);
    }
  },

  addCard: async (listId, title) => {
    try {
      const columnMap: Record<string, number> = {
        backlog: 0,
        todo: 1,
        inprogress: 2,
        done: 3,
      };
      const column = columnMap[listId] ?? 0;

      const newTaskArray = await createTask(title, column, 0);
      const newTask = newTaskArray[0];

      console.log('Created task from backend:', newTask);

      set((state) => {
        const list = state.lists.find((l) => l.id === listId);
        if (!list) return state;

        const newCard: Card = {
          id: newTask?.id?.toString() ?? Date.now().toString(),
          title: newTask?.title ?? title,
        };

        list.cards.push(newCard);

        return { lists: [...state.lists] };
      });
    } catch (error) {
      console.error('Error adding card:', error);
    }
  },

  removeCard: async (listId, cardId) => {
    try {
      await deleteTask(cardId);

      set((state) => {
        const list = state.lists.find((l) => l.id === listId);
        if (!list) return state;
        list.cards = list.cards.filter((c) => c.id !== cardId);
        return { lists: [...state.lists] };
      });
    } catch (error) {
      console.error("Failed to delete card from backend:", error);
    }
  },

  moveList: (fromIndex, toIndex) => {
    set((state) => {
      const updatedLists = Array.from(state.lists);
      const [movedList] = updatedLists.splice(fromIndex, 1);
      updatedLists.splice(toIndex, 0, movedList);
      return { lists: updatedLists };
    });
  },

  loadTasksFromBackend: async () => {
    try {
      const tasks: BackendTask[] = await fetchTasks();

      console.log('Fetched tasks from DB:', tasks);

      set((state) => {
        const columnToListId: Record<number, string> = {
          0: 'backlog',
          1: 'todo',
          2: 'inprogress',
          3: 'done',
        };

        const cardsByListId: Record<string, Card[]> = {
          backlog: [],
          todo: [],
          inprogress: [],
          done: [],
        };

        tasks.forEach((task) => {
          const listId = columnToListId[task.column] || 'backlog';
          cardsByListId[listId].push({
            id: task.id.toString(),
            title: task.title,
          });
        });

        const updatedLists = state.lists.map((list) => ({
          ...list,
          cards: cardsByListId[list.id] || [],
        }));

        return { lists: updatedLists };
      });
    } catch (error) {
      console.error('Failed to load tasks from backend', error);
    }
  },
}));
