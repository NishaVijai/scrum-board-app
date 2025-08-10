import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { List } from './List';
import { useBoardStore } from '../store/useBoardStore';
import { type List as ListType } from '../types';

export const Board = () => {
  const lists = useBoardStore((state) => state.lists);
  const loadTasksFromBackend = useBoardStore((state) => state.loadTasksFromBackend);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadTasksFromBackend();
      setLoading(false);
    };
    init();
  }, [loadTasksFromBackend]);

  if (loading) {
    return (
      <div className="board-loading">
        <p>Loading board...</p>
      </div>
    );
  }

  const isEmpty = lists.every((list) => list.cards.length === 0);

  if (isEmpty) {
    return (
      <div className="board-empty">
        <p>No tasks found. Start by adding a card!</p>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="board-lists">
        {lists.map((list: ListType, index: number) => (
          <List key={list.id} list={list} index={index} />
        ))}
      </div>
    </DndProvider>
  );
};
