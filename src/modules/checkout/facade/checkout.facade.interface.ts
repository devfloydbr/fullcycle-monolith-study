export interface PlaceOrderCheckoutFacadeInputDto {
  clientId: string
  products: {
    productId: string
  }[]
}

export interface PlaceOrderCheckoutFacadeOutputDto {
  id: string
  invoiceId: string
  status: string
  total: number
  products: {
    productId: string
  }[]
}

export default interface CheckoutFacadeInterface {
  placeOrder(
    input: PlaceOrderCheckoutFacadeInputDto
  ): Promise<PlaceOrderCheckoutFacadeOutputDto>
}
