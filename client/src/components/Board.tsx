import { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { List } from './List';
import { useBoardStore } from '../store/useBoardStore';
import { type List as ListType } from '../types';

export const Board = () => {
  const lists = useBoardStore((state) => state.lists);
  const loadTasksFromBackend = useBoardStore((state) => state.loadTasksFromBackend);

  useEffect(() => {
    loadTasksFromBackend();
  }, [loadTasksFromBackend]);

  return (
    <DndProvider backend={HTML5Backend}>
      <section className="board-lists">
        {lists.map((list: ListType) => (
          <List key={list.id} list={list} />
        ))}
      </section>
    </DndProvider>
  );
};
