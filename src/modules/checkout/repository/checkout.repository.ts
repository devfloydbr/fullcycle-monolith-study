import Id from '../../@shared/domain/value-object/id.value-object'

import ProductModel from './product.model'
import CheckoutGateway from '../gateway/checkout.gateway'
import Order from '../domain/order.entity'
import OrderModel from './order.model'
import Client from '../domain/client.entity'
import Address from '../../invoice/domain/value-object/address.value-object'
import Product from '../domain/product.entity'

export default class CheckoutRepository implements CheckoutGateway {
  async addOrder(order: Order): Promise<void> {
    await OrderModel.create(
      {
        id: order.id.id,
        client_id: order.client.id.id,
        items: order.products.map(item => ({
          id: item.id.id,
          name: item.name,
          description: item.description,
          salesPrice: item.salesPrice
        })),
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      },
      {
        include: [
          {
            model: ProductModel
          }
        ]
      }
    )
  }

  async findOrder(id: string): Promise<Order | null> {
    const order = await OrderModel.findOne({
      where: { id },
      include: ['items', 'client']
    })

    if (!order) {
      throw new Error('Order not found.')
    }

    return new Order({
      id: new Id(order.id),
      client: new Client({
        id: new Id(order.client.id),
        name: order.client.name,
        email: order.client.email,
        document: order.client.document,
        address: new Address({
          street: order.client.street,
          number: order.client.number,
          complement: order.client.complement,
          city: order.client.city,
          state: order.client.state,
          zipCode: order.client.zipCode
        })
      }),
      products: order.items.map(item => {
        return new Product({
          id: new Id(item.id),
          name: item.name,
          description: item.description,
          salesPrice: item.salesPrice
        })
      })
    })
  }
}
