export type Card = {
  id: string
  title: string
}

export type List = {
  id: string
  title: string
  cards: Card[]
}

export const ItemTypes = {
  CARD: 'card',
};