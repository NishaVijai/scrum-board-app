import { create } from 'zustand';
import { type Card, type List } from '../types';
import { createTask, updateTask, deleteTask, updateColumnsOrder, fetchTasks } from '../api';

interface BoardState {
  lists: List[];
  addCard: (listId: string, title: string) => Promise<void>;
  updateCardTitle: (cardId: string, title: string) => Promise<void>;
  updateCardDescription: (cardId: string, description: string) => Promise<void>;
  moveCard: (cardId: string, fromListId: string, toListId: string) => Promise<void>;
  removeCard: (cardId: string) => Promise<void>;
  moveList: (fromIndex: number, toIndex: number) => Promise<void>;
  loadTasksFromBackend: () => Promise<void>;
  setLists: (lists: List[]) => void;
}

interface BackendTask {
  id: string; // MongoDB ObjectId
  title: string;
  description?: string | null;
  column: number;
  row: number;
}

export const useBoardStore = create<BoardState>((set, get) => {
  const loadListsFromStorage = () => {
    const savedLists = localStorage.getItem('boardLists');
    return savedLists
      ? JSON.parse(savedLists)
      : [
        { id: 'backlog', title: 'Backlog', cards: [] },
        { id: 'todo', title: 'To Do', cards: [] },
        { id: 'inprogress', title: 'In Progress', cards: [] },
        { id: 'done', title: 'Done', cards: [] },
      ];
  };

  const initialLists = loadListsFromStorage();

  return {
    lists: initialLists,

    setLists: (lists) => {
      localStorage.setItem('boardLists', JSON.stringify(lists));
      set({ lists });
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

        const currentList = get().lists.find((l) => l.id === listId);
        const row = currentList ? currentList.cards.length : 0;

        await createTask(title, column, row); // backend generates MongoDB _id
        await get().loadTasksFromBackend();
      } catch (error) {
        console.error('Error adding card:', error);
      }
    },

    updateCardTitle: async (cardId, title) => {
      try {
        const tasks: BackendTask[] = await fetchTasks();
        const task = tasks.find((t) => t.id === cardId);
        if (!task) throw new Error('Task not found');

        const updatedTask = { ...task, title };
        await updateTask(updatedTask);

        await get().loadTasksFromBackend();
      } catch (error) {
        console.error('Failed to update title:', error);
      }
    },

    updateCardDescription: async (cardId, description) => {
      try {
        const tasks: BackendTask[] = await fetchTasks();
        const task = tasks.find((t) => t.id === cardId);

        if (!task) {
          // fallback: update local state only
          set((state) => {
            const updatedLists = state.lists.map((l) => ({
              ...l,
              cards: l.cards.map((c) =>
                c.id === cardId ? { ...c, description } : c
              ),
            }));
            localStorage.setItem('boardLists', JSON.stringify(updatedLists));
            return { lists: updatedLists };
          });
          return;
        }

        const updatedTask = { ...task, description };
        await updateTask(updatedTask);

        await get().loadTasksFromBackend();
      } catch (error) {
        console.error('Failed to update description:', error);
      }
    },

    moveCard: async (cardId, fromListId, toListId) => {
      try {
        const columnMap: Record<string, number> = {
          backlog: 0,
          todo: 1,
          inprogress: 2,
          done: 3,
        };

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

        // Update backend task positions
        const updateAllCards = async (listId: string, column: number) => {
          const list = get().lists.find((l) => l.id === listId);
          if (!list) return;

          for (let i = 0; i < list.cards.length; i++) {
            const card = list.cards[i];
            await updateTask({
              id: card.id,
              title: card.title,
              column,
              row: i,
              description: card.description,
            });
          }
        };

        await updateAllCards(toListId, columnMap[toListId]);
        await updateAllCards(fromListId, columnMap[fromListId]);

        await get().loadTasksFromBackend();
      } catch (error) {
        console.error('Failed to move card:', error);
      }
    },

    removeCard: async (cardId: string) => {
      try {
        await deleteTask(cardId);
        await get().loadTasksFromBackend();
      } catch (error) {
        console.error('Failed to delete card:', error);
      }
    },

    moveList: async (fromIndex, toIndex) => {
      try {
        set((state) => {
          const updatedLists = [...state.lists];
          const [movedList] = updatedLists.splice(fromIndex, 1);
          updatedLists.splice(toIndex, 0, movedList);
          localStorage.setItem('boardLists', JSON.stringify(updatedLists));
          return { lists: updatedLists };
        });

        const orderedListIds = get().lists.map((list) => list.id);
        await updateColumnsOrder(orderedListIds);
      } catch (error) {
        console.error('Failed to sync list order with backend', error);
      }
    },

    loadTasksFromBackend: async () => {
      try {
        const tasks: BackendTask[] = await fetchTasks();

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
            id: task.id,
            title: task.title,
            row: task.row,
            description: task.description ?? '',
          });
        });

        Object.keys(cardsByListId).forEach((key) => {
          cardsByListId[key].sort((a, b) => a.row - b.row);
        });

        const updatedLists: List[] = [
          { id: 'backlog', title: 'Backlog', cards: cardsByListId.backlog },
          { id: 'todo', title: 'To Do', cards: cardsByListId.todo },
          { id: 'inprogress', title: 'In Progress', cards: cardsByListId.inprogress },
          { id: 'done', title: 'Done', cards: cardsByListId.done },
        ];

        set({ lists: updatedLists });
        localStorage.setItem('boardLists', JSON.stringify(updatedLists));
      } catch (error) {
        console.error('Failed to load tasks from backend:', error);
      }
    },
  };
});
