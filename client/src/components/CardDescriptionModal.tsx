import { useEffect, useState } from 'react';

type Props = {
  cardId: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (description: string) => void;
};

export const CardDescriptionModal = ({
  description,
  isOpen,
  onClose,
  onSave,
}: Props) => {
  const [currentDescription, setCurrentDescription] = useState(description);

  // Sync currentDescription when modal opens or description changes
  useEffect(() => {
    if (isOpen) {
      setCurrentDescription(description);
    }
  }, [description, isOpen]);

  // Lock background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(currentDescription.trim());
    onClose();
  };

  return (
    <section
      className="modal-overlay"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <section
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Edit Description</h2>

        <label htmlFor="description-textarea">Description</label>
        <textarea
          id="description-textarea"
          rows={6}
          value={currentDescription}
          onChange={(e) => setCurrentDescription(e.target.value)}
          placeholder="Enter card description..."
        />

        <section className="modal-actions">
          <button
            type="button"
            className="modal-actions-cancel"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="modal-actions-save"
            onClick={handleSave}
          >
            Save
          </button>
        </section>
      </section>
    </section>
  );
};
