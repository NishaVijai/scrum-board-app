import { useEffect, useState } from 'react';
import { getTask } from '../api';

type Props = {
  cardId: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (description: string) => void;
};

export const CardDescriptionModal = ({ cardId, description, isOpen, onClose, onSave }: Props) => {
  const [currentDescription, setCurrentDescription] = useState(description);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError(null);
        const task = await getTask(cardId);
        setCurrentDescription(task.description || '');
      } catch (err) {
        setError('Failed to load description. Please try again later.');
        setCurrentDescription('');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && !description) {
      fetchDescription();
    } else {
      setCurrentDescription(description);
      setLoading(false);
    }
  }, [cardId, isOpen, description]);

  if (!isOpen) return null;

  return (
    <section className="modal-overlay" onClick={onClose}>
      <section className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Description</h2>

        {loading && !error ? (
          <p className="modal-loading-text">Loading...</p>
        ) : error ? (
          <p className="modal-error-text">{error}</p>
        ) : (
          <>
            <label htmlFor="description-label">Description</label>
            <textarea
              id="description-textarea"
              name="description"
              rows={6}
              value={currentDescription}
              onChange={(e) => setCurrentDescription(e.target.value)}
            />
            <section className="modal-actions">
              <button className="modal-actions-cancel" onClick={onClose}>Cancel</button>
              <button
                className="modal-actions-save"
                onClick={() => {
                  onSave(currentDescription);
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
