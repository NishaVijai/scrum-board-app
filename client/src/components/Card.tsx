import { useState, forwardRef } from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes, type Card as CardType } from '../types';
import { CardDescriptionModal } from './CardDescriptionModal';
import { useBoardStore } from '../store/useBoardStore';

type Props = {
  card: CardType;
  listId: string;
  onDelete?: () => void;
};

export const Card = forwardRef<HTMLLIElement, Props>(({ card, listId, onDelete }, ref) => {
  const [modalOpen, setModalOpen] = useState(false);
  const updateDescription = useBoardStore((s) => s.updateCardDescription);

  const handleSave = async (newDescription: string) => {
    await updateDescription(card.id, newDescription);
  };

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: { id: card.id, listId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <>
      <li
        onClick={() => setModalOpen(true)}
        ref={(node) => {
          drag(node);
          if (typeof ref === 'function') ref(node);
          if (ref && 'current' in ref) ref.current = node;
        }}
        className="card-item"
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: 'pointer',
        }}
      >
        <span>{card.title}</span>
        {onDelete && (
          <button
            type="button"
            className="card-delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            aria-label={`Delete card ${card.title}`}
          >
            ✕
          </button>
        )}
      </li>

      <CardDescriptionModal
        cardId={card.id}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </>
  );
});

Card.displayName = 'Card';
