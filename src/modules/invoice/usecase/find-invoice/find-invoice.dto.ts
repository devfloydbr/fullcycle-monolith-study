export interface FindInvoiceUseCaseInputDto {
  id: string
}

export interface FindInvoiceUseCaseOutputDto {
  id: string
  name: string
  document: string
  street: string
  number: number
  complement: string
  city: string
  state: string
  zipCode: string
  items: {
    id: string
    name: string
    price: number
  }[]
}
