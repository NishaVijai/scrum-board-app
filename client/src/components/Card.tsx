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
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const updateDescription = useBoardStore(
    (s) => s.updateCardDescription
  );

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    setConfirmDeleteOpen(false);
    onDelete?.();
  };

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
            onClick={handleDeleteClick}
          >
            ✕
          </button>
        )}
      </div>

      {/* Card description modal */}
      <CardDescriptionModal
        cardId={card.id}
        description={card.description ?? ''}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(desc) => updateDescription(card.id, desc)}
      />

      {/* Delete confirmation modal */}
      {confirmDeleteOpen && (
        <div
          className="modal-overlay"
          onClick={() => setConfirmDeleteOpen(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Delete card?</h2>
            <p>Are you sure you want to delete this card?</p>

            <div className="modal-actions">
              <button
                className="modal-actions-cancel"
                onClick={() => setConfirmDeleteOpen(false)}
              >
                Cancel
              </button>
              <button
                className="modal-actions-save"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
