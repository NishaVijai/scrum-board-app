export type Card = {
  id: string; // changed from number to string
  title: string;
  row: number;
  description?: string | null;
};

export type List = {
  id: string;
  title: string;
  cards: Card[];
};

export const ItemTypes = {
  CARD: 'card',
};
