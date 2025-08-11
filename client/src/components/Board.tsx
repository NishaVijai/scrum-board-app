import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { List } from './List';
import { useBoardStore } from '../store/useBoardStore';
import { type List as ListType } from '../types';

export const Board = () => {
  const lists = useBoardStore((state) => state.lists);

  return (
    <DndProvider backend={HTML5Backend}>
      <section className="board-lists">
        {lists.map((list: ListType, index: number) => (
          <List key={list.id} list={list} index={index} />
        ))}
      </section>
    </DndProvider>
  );
};
