// src/components/Card.tsx
import { useState } from 'react';
import { type Card as CardType } from '../types';
import { CardDescriptionModal } from './CardDescriptionModal';
import { useBoardStore } from '../store/useBoardStore';

type Props = {
  card: CardType;
  onDelete?: () => void;
};

export const Card = ({ card, onDelete }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);

  const updateDescription = useBoardStore(
    (s) => s.updateCardDescription
  );

  return (
    <>
      <div
        className="card-item"
        onClick={() => setModalOpen(true)}
      >
        <span>{card.title}</span>

        {onDelete && (
          <button
            type="button"
            className="card-delete-btn"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            ✕
          </button>
        )}
      </div>

      <CardDescriptionModal
        cardId={card.id}
        description={card.description ?? ''}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(desc) => updateDescription(card.id, desc)}
      />
    </>
  );
};
