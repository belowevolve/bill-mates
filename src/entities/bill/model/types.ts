export interface BillItem {
  id: string
  name: string
  price: number
  amount: number
}

export interface Bill {
  id: string
  label: string
  matesItems: Record<string, BillItem[]>
  total: number
  createdAt: string
  updatedAt: string
}
