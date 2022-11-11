import Id from '../../../@shared/domain/value-object/id.value-object'

import InvoiceGateway from '../../gateway/invoice.gateway'
import {
  GenerateInvoiceUseCaseInputDto,
  GenerateInvoiceUseCaseOutputDto
} from './generate-invoice.dto'
import Invoice from '../../domain/entity/invoice.entity'
import Address from '../../domain/value-object/address.value-object'
import Product from '../../domain/entity/product.entity'

export default class GenerateInvoiceUseCase {
  private _invoiceRepository: InvoiceGateway

  constructor(invoiceRepository: InvoiceGateway) {
    this._invoiceRepository = invoiceRepository
  }

  async execute(
    input: GenerateInvoiceUseCaseInputDto
  ): Promise<GenerateInvoiceUseCaseOutputDto> {
    const props = {
      id: new Id(input.id) || new Id(),
      name: input.name,
      document: input.document,
      address: new Address({
        street: input.street,
        number: input.number,
        complement: input.complement,
        city: input.city,
        state: input.state,
        zipCode: input.zipCode
      }),
      items: input.items.map(
        i =>
          new Product({
            id: new Id(i.id),
            name: i.name,
            price: i.price
          })
      )
    }

    const invoice = new Invoice(props)

    await this._invoiceRepository.generate(invoice)

    return {
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
      total: invoice.total()
    }
  }
}
