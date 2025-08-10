import { forwardRef } from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes, type Card as CardType } from '../types';

type Props = {
  card: CardType;
  listId: string;
  onDelete?: () => void;
};

export const Card = forwardRef<HTMLLIElement, Props>(({ card, listId, onDelete }, ref) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: { id: card.id, listId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <li
      ref={(node) => {
        drag(node);
        if (typeof ref === 'function') ref(node);
        if (ref && 'current' in ref) ref.current = node;
      }}
      className="card-item"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    >
      <span>{card.title}</span>
      {onDelete && (
        <button
          type="button"
          className="card-delete-btn"
          onClick={onDelete}
          aria-label={`Delete card ${card.title}`}
        >
          ✕
        </button>
      )}
    </li>
  );
});

Card.displayName = 'Card';
