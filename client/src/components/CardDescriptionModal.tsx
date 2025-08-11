import { useEffect, useState } from 'react';
import { getTask } from '../api';

type Props = {
  cardId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (description: string) => void;
};

export const CardDescriptionModal = ({ cardId, isOpen, onClose, onSave }: Props) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        setLoading(true);
        const task = await getTask(cardId);
        setDescription(task.description || '');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) fetchDescription();
  }, [cardId, isOpen]);

  if (!isOpen) return null;

  return (
    <section className="modal-overlay" onClick={onClose}>
      <section className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Description</h2>
        {loading ? (
          <p className="modal-loading-text">Loading...</p>
        ) : (
          <>
            <label htmlFor="description-label">Description</label>
            <textarea
              id="description-textarea"
              name="description"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <section className="modal-actions">
              <button onClick={onClose}>Cancel</button>
              <button
                onClick={() => {
                  onSave(description);
                  onClose();
                }}
              >
                Save
              </button>
            </section>
          </>
        )}
      </section>
    </section>
  );
};
