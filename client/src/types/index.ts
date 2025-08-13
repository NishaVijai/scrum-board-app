export type Card = {
  id: number
  title: string
  row: number
  description?: string | null
}

export type List = {
  id: number
  title: string
  cards: Card[]
}

export const ItemTypes = {
  CARD: 'card',
};