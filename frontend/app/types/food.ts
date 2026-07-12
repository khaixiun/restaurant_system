export interface Food {
  id: number
  name: string
  description: string | null
  price: number
  imageUrl: string | null
  categoryId: number
  categoryName: string
  createdAt: string
}