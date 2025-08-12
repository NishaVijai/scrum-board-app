export type Card = {
  id: string
  title: string
  row: number
  description?: string | null
}

export type List = {
  id: string
  title: string
  cards: Card[]
}

export const ItemTypes = {
  CARD: 'card',
};