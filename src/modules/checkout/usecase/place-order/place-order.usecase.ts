import UseCaseInterface from '../../../@shared/usecase/use-case.interface'
import { PlaceOrderInputDto, PlaceOrderOutputDto } from './place-order.dto'
import ClientAdmFacadeInterface from '../../../client-adm/facade/client-adm.facade.interface'
import ProductAdmFacadeInterface from '../../../product-adm/facade/product-adm.facade.interface'

import StoreCatalogFacadeInterface from '../../../store-catalog/facade/store-catalog.facade.interface'
import Id from '../../../@shared/domain/value-object/id.value-object'
import Client from '../../domain/client.entity'
import Address from '../../../invoice/domain/value-object/address.value-object'
import InvoiceFacadeInterface from '../../../invoice/facade/invoice.facade.interface'
import PaymentFacadeInterface from '../../../payment/facade/facade.interface'
import CheckoutGateway from '../../gateway/checkout.gateway'
import Order from '../../domain/order.entity'
import Product from '../../domain/product.entity'

export default class PlaceOrderUseCase implements UseCaseInterface {
  private _clientFacade: ClientAdmFacadeInterface
  private _productFacade: ProductAdmFacadeInterface
  private _storeCatalogFacade: StoreCatalogFacadeInterface
  private _invoiceFacade: InvoiceFacadeInterface
  private _paymentFacade: PaymentFacadeInterface
  private _repository: CheckoutGateway

  constructor(
    clientFacade: ClientAdmFacadeInterface,
    productFacade: ProductAdmFacadeInterface,
    storeCatalogFacade: StoreCatalogFacadeInterface,
    invoiceFacade: InvoiceFacadeInterface,
    paymentFacade: PaymentFacadeInterface,
    repository: CheckoutGateway
  ) {
    this._clientFacade = clientFacade
    this._productFacade = productFacade
    this._storeCatalogFacade = storeCatalogFacade
    this._invoiceFacade = invoiceFacade
    this._paymentFacade = paymentFacade
    this._repository = repository
  }

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    const findClient = await this._clientFacade.find({ id: input.clientId })

    if (!findClient) {
      throw new Error('Client not found.')
    }

    await this.validateProducts(input)

    const products = await Promise.all(
      input.products.map(product => this.getProduct(product.productId))
    )

    const client = new Client({
      id: new Id(findClient.id),
      name: findClient.name,
      email: findClient.email,
      document: findClient.document,
      address: new Address({
        street: findClient.address.street,
        number: findClient.address.number,
        complement: findClient.address.complement,
        city: findClient.address.city,
        state: findClient.address.state,
        zipCode: findClient.address.zipCode
      })
    })

    const order = new Order({
      client,
      products
    })

    const payment = await this._paymentFacade.process({
      orderId: order.id.id,
      amount: order.total
    })

    const invoice =
      payment.status === 'approved'
        ? await this._invoiceFacade.generate({
            name: client.name,
            document: client.document,
            street: client.address.street,
            number: client.address.number,
            complement: client.address.complement,
            city: client.address.city,
            state: client.address.state,
            zipCode: client.address.zipCode,
            items: products.map(product => {
              return {
                id: product.id.id,
                name: product.name,
                price: product.salesPrice
              }
            })
          })
        : null

    payment.status === 'approved' && order.approve()

    await this._repository.addOrder(order)

    return {
      id: order.id.id,
      invoiceId: payment.status === 'approved' ? invoice.id : null,
      status: order.status,
      total: order.total,
      products: order.products.map(product => {
        return {
          productId: product.id.id
        }
      })
    }
  }

  private async validateProducts(input: PlaceOrderInputDto): Promise<void> {
    if (input.products.length === 0) {
      throw new Error('Products not provided.')
    }

    for (const p of input.products) {
      const product = await this._productFacade.checkStock({
        productId: p.productId
      })

      if (product.stock <= 0) {
        throw new Error(
          `Product ${product.productId} is not available in stock.`
        )
      }
    }
  }

  private async getProduct(productId: string): Promise<Product> {
    const product = await this._storeCatalogFacade.find({ id: productId })

    if (!product) {
      throw new Error('Product not found.')
    }

    const productProps = {
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice
    }

    return new Product(productProps)
  }
}
