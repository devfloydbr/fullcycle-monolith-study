import Id from '../../../@shared/domain/value-object/id.value-object'

import Address from '../../domain/value-object/address.value-object'
import FindInvoiceUseCase from './find-invoice.usecase'
import Product from '../../domain/entity/product.entity'
import Invoice from '../../domain/entity/invoice.entity'

const product1 = new Product({
  id: new Id('1'),
  name: 'Product 1',
  price: 200
})

const product2 = new Product({
  id: new Id('2'),
  name: 'Product 2',
  price: 1000
})

const address = new Address({
  street: 'Street',
  number: 0,
  complement: '',
  city: 'City',
  state: 'State',
  zipCode: '00000-000'
})

const invoice = new Invoice({
  id: new Id('1'),
  name: 'Invoice',
  document: '000.000.000-00',
  address,
  items: [product1, product2]
})

const mockInvoiceRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice))
  }
}

describe('Find Invoice use case unit test', () => {
  it('Should be able to find a invoice', async () => {
    const invoiceRepository = mockInvoiceRepository()
    const useCase = new FindInvoiceUseCase(invoiceRepository)

    const findInvoice = await useCase.execute({ id: invoice.id.id })

    expect(invoiceRepository.find).toBeCalled()
    expect(findInvoice.name).toEqual(invoice.name)
    expect(findInvoice.city).toEqual(invoice.address.city)
    expect(findInvoice.complement).toEqual(invoice.address.complement)
    expect(findInvoice.document).toEqual(invoice.document)
    expect(findInvoice.number).toEqual(invoice.address.number)
    expect(findInvoice.state).toEqual(invoice.address.state)
    expect(findInvoice.street).toEqual(invoice.address.street)

    expect(findInvoice.items.length).toBe(2)
    expect(findInvoice.items[0].id).toEqual('1')
    expect(findInvoice.items[0].name).toEqual('Product 1')
    expect(findInvoice.items[0].price).toBe(200)

    expect(findInvoice.items[1].id).toEqual('2')
    expect(findInvoice.items[1].name).toEqual('Product 2')
    expect(findInvoice.items[1].price).toBe(1000)
  })
})
