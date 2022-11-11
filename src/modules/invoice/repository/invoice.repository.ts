import Id from '../../@shared/domain/value-object/id.value-object'

import InvoiceModel from './invoice.model'
import InvoiceGateway from '../gateway/invoice.gateway'
import Invoice from '../domain/entity/invoice.entity'
import Address from '../domain/value-object/address.value-object'
import Product from '../domain/entity/product.entity'
import ProductModel from './product.model'

export default class InvoiceRepository implements InvoiceGateway {
  async generate(invoice: Invoice): Promise<void> {
    await InvoiceModel.create(
      {
        id: invoice.id.id,
        name: invoice.name,
        document: invoice.document,
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
        items: invoice.items.map(item => ({
          id: item.id.id,
          name: item.name,
          price: item.price
        })),
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt
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

  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({
      where: { id },
      include: ['items']
    })

    if (!invoice) {
      throw new Error('Invoice not found.')
    }

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address: new Address({
        street: invoice.street,
        number: invoice.number,
        complement: invoice.complement,
        city: invoice.city,
        state: invoice.state,
        zipCode: invoice.zipCode
      }),
      items: invoice.items.map(item => {
        return new Product({
          id: new Id(item.id),
          name: item.name,
          price: item.price
        })
      }),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt
    })
  }
}
