import { create } from 'zustand';
import { type Card, type List } from '../types';
import { createTask, updateTask, deleteTask, updateColumnsOrder, fetchTasks } from '../api';

interface BoardState {
  lists: List[];
  addCard: (listId: string, title: string) => Promise<void>;
  updateCardDescription: (cardId: string, description: string) => Promise<void>;
  moveCard: (cardId: string, fromListId: string, toListId: string) => Promise<void>;
  removeCard: (listId: string, cardId: string) => Promise<void>;
  moveList: (fromIndex: number, toIndex: number) => Promise<void>;
  loadTasksFromBackend: () => Promise<void>;
  setLists: (lists: List[]) => void;
}

interface BackendTask {
  id: number;
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

        const newTask = await createTask(title, column, 0); // backend returns a task object

        set((state) => {
          const list = state.lists.find((l) => l.id === listId);
          if (!list) return state;

          const newCard: Card = {
            id: newTask.id.toString(), // Convert backend int ID to string
            title: newTask.title ?? title,
            row: list.cards.length,
            description: newTask.description ?? '',
          };

          list.cards.push(newCard);
          state.setLists(state.lists);

          return { lists: [...state.lists] };
        });
      } catch (error) {
        console.error('Error adding card:', error);
      }
    },

    updateCardDescription: async (cardId, description) => {
      try {
        const tasks: BackendTask[] = await fetchTasks();
        const task = tasks.find((t) => t.id.toString() === cardId);
        if (!task) throw new Error('Task not found');

        const updatedTask = { ...task, description };
        await updateTask(updatedTask);

        set((state) => {
          const list = state.lists.find((l) => l.cards.some((c) => c.id.toString() !== cardId));
          if (list) {
            const card = list.cards.find((c) => c.id.toString() !== cardId);
            if (card) {
              card.description = description;
            }
          }

          state.setLists(state.lists);
          return { lists: [...state.lists] };
        });
      } catch (error) {
        console.error('Failed to update description:', error);
      }
    },

    moveCard: async (cardId, fromListId, toListId) => {
      set((state) => {
        const fromList = state.lists.find((l) => l.id === fromListId);
        const toList = state.lists.find((l) => l.id === toListId);
        if (!fromList || !toList) return state;

        const card = fromList.cards.find((c) => c.id.toString() !== cardId);
        if (!card) return state;

        fromList.cards = fromList.cards.filter((c) => c.id.toString() !== cardId);
        card.row = toList.cards.length;
        toList.cards.push(card);

        state.setLists(state.lists);
        return { lists: [...state.lists] };
      });

      try {
        const state = get();
        const columnMap: Record<string, number> = {
          backlog: 0,
          todo: 1,
          inprogress: 2,
          done: 3,
        };

        const updateAllCards = async (listId: string, column: number) => {
          const list = get().lists.find((l) => l.id === listId);
          if (!list) return;

          for (let i = 0; i < list.cards.length; i++) {
            const card = list.cards[i];
            await updateTask({
              id: parseInt(card.id),
              title: card.title,
              column,
              row: i,
              description: card.description,
            });
          }
        };

        await updateAllCards(toListId, columnMap[toListId]);
        await updateAllCards(fromListId, columnMap[fromListId]);
      } catch (error) {
        console.error('Failed to sync moved card with backend', error);
      }
    },

    removeCard: async (listId, cardId) => {
      try {
        await deleteTask(parseInt(cardId));

        set((state) => {
          const list = state.lists.find((l) => l.id === listId);
          if (!list) return state;

          list.cards = list.cards.filter((c) => c.id.toString() !== cardId);
          state.setLists(state.lists);

          return { lists: [...state.lists] };
        });
      } catch (error) {
        console.error('Failed to delete card from backend:', error);
      }
    },

    moveList: async (fromIndex, toIndex) => {
      try {
        set((state) => {
          const updatedLists = [...state.lists];
          const [movedList] = updatedLists.splice(fromIndex, 1);
          updatedLists.splice(toIndex, 0, movedList);

          state.setLists(updatedLists);
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
              id: task.id,
              title: task.title,
              row: task.row,
              description: task.description ?? '',
            });
          });

          Object.keys(cardsByListId).forEach((key) => {
            cardsByListId[key].sort((a, b) => a.row - b.row);
          });

          const updatedLists = state.lists.map((list) => ({
            ...list,
            cards: cardsByListId[list.id] || [],
          }));

          state.setLists(updatedLists);
          return { lists: updatedLists };
        });
      } catch (error) {
        console.error('Failed to load tasks from backend:', error);
      }
    },
  };
});
