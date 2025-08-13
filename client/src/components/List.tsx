import { useState, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useBoardStore } from '../store/useBoardStore';
import { ItemTypes, type Card as CardType, type List as ListType } from '../types';
import { Card } from './Card';

type Props = {
  list: ListType;
};

export const List = ({ list }: Props) => {
  const addCard = useBoardStore((s) => s.addCard);
  const removeCard = useBoardStore((s) => s.removeCard);
  const moveCard = useBoardStore((s) => s.moveCard);
  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const dropRef = useRef<HTMLDivElement | null>(null);

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: (item: { id: number; listId: string }) => {
      if (item.listId !== list.id) {
        moveCard(item.id, item.listId, list.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drop(dropRef);

  const handleAdd = () => {
    if (newTitle.trim()) {
      addCard(list.id, newTitle);
      setNewTitle('');
      setIsAdding(false);
      console.log(`Card added to list ${list.id}: ${newTitle}`);
    }
  };

  const handleCancel = () => {
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <section
      ref={dropRef}
      className={`list ${isOver ? 'is-over' : ''}`}
      style={{ border: isOver ? '2px solid green' : '' }}
    >
      <h2 className="list-header">{list.title}</h2>
      <ul className="list-items">
        {list.cards.map((card: CardType) => (
          <Card
            key={card.id}
            card={card}
            listId={list.id}
            onDelete={() => removeCard(card.id)}
          />
        ))}
      </ul>

      {!isAdding && (
        <section className="add-a-card-button">
          <button onClick={() => setIsAdding(true)}>+ Add a card</button>
        </section>
      )}

      {isAdding && (
        <section className="add-card">
          <input
            ref={inputRef}
            placeholder="Add new card..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <section className="add-card-buttons">
            <button onClick={handleAdd}>Add card</button>
            <button onClick={handleCancel}>X</button>
          </section>
        </section>
      )}
    </section>
  );
};
