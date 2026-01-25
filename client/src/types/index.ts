// -------------------------------
// Card type
// -------------------------------
export type Card = {
  id: string;           // Unique string ID
  title: string;        // Card title
  row: number;          // Position within the list
  description?: string | null; // Optional description
};

// -------------------------------
// List type
// -------------------------------
export type List = {
  id: string;       // Unique list ID
  title: string;    // List title
  cards: Card[];    // Array of cards in this list
};

// -------------------------------
// Drag-and-drop item types
// -------------------------------
export const ItemTypes = {
  CARD: 'card',
};
