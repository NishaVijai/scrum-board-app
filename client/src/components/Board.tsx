import { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { List } from './List';
import { useBoardStore } from '../store/useBoardStore';
import { type List as ListType } from '../types';

export const Board = () => {
  const {
    lists,
    isLoading,
    hasColdStartDelay,
    error,
    loadTasksFromBackend,
  } = useBoardStore();

  useEffect(() => {
    loadTasksFromBackend();
  }, [loadTasksFromBackend]);

  if (isLoading) {
    return (
      <section className="board-loading">
        <p>Loading your tasks…</p>

        {hasColdStartDelay && (
          <p className="cold-start-tip">
            First load may take a bit — the server is waking up ☕
          </p>
        )}

        {error && <p className="error">{error}</p>}
      </section>
    );
  }

  // if (error) {
  //   return <p className="error">{error}</p>;
  // }

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
