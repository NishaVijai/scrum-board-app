// src/components/List.tsx
import { useState, useRef, useEffect } from 'react';
import { useDrop, useDrag, type DropTargetMonitor } from 'react-dnd';
import { useBoardStore } from '../store/useBoardStore';
import { ItemTypes, type Card as CardType, type List as ListType } from '../types';
import { Card } from './Card';

type Props = {
  list: ListType;
};

type DragItem = {
  id: string;
  listId: string;
  index: number;
};

export const List = ({ list }: Props) => {
  const addCard = useBoardStore((s) => s.addCard);
  const removeCard = useBoardStore((s) => s.removeCard);
  const moveCard = useBoardStore((s) => s.moveCard);

  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isAdding) inputRef.current?.focus();
  }, [isAdding]);

  // -------------------------------
  // Drop zone for list
  // -------------------------------
  const [, drop] = useDrop<DragItem>({
    accept: ItemTypes.CARD,
    hover: (item, monitor: DropTargetMonitor) => {
      if (!dropRef.current) return;

      const hoverBoundingRect = dropRef.current.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const hoverY = clientOffset.y - hoverBoundingRect.top;
      let targetIndex = list.cards.length;

      for (let i = 0; i < list.cards.length; i++) {
        const cardEl = document.getElementById(`card-${list.cards[i].id}`);
        if (!cardEl) continue;

        const rect = cardEl.getBoundingClientRect();
        const midY = rect.top + rect.height / 2 - hoverBoundingRect.top;

        if (hoverY < midY) {
          targetIndex = i;
          break;
        }
      }

      if (item.listId === list.id && item.index === targetIndex) return;

      void moveCard(item.id, item.listId, list.id, targetIndex);
      item.listId = list.id;
      item.index = targetIndex;
    },
  });

  drop(dropRef);

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    await addCard(list.id, newTitle.trim());
    setNewTitle('');
    setIsAdding(false);
  };

  const handleCancel = () => {
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <section ref={dropRef} className="list">
      <h2 className="list-header">{list.title}</h2>

      <ul className="list-items">
        {list.cards.map((card, index) => (
          <DraggableCard
            key={card.id}
            card={card}
            listId={list.id}
            index={index}
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
            id="new-card-title"
            name="newCardTitle"
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

// -------------------------------
// Draggable Card
// -------------------------------
type DraggableCardProps = {
  card: CardType;
  listId: string;
  index: number;
  onDelete: () => void;
};

const DraggableCard = ({ card, listId, index, onDelete }: DraggableCardProps) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: { id: card.id, listId, index } as DragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // ✅ Properly typed ref bridge
  const setRef = (node: HTMLLIElement | null) => {
    if (node) {
      drag(node);
    }
  };

  return (
    <li
      id={`card-${card.id}`}
      ref={setRef}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
      }}
    >
      <Card card={card} onDelete={onDelete} />
    </li>
  );
};
