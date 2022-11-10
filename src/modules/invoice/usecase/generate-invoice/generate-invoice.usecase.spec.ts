import GenerateInvoiceUseCase from './generate-invoice.usecase'
import { GenerateInvoiceUseCaseInputDto } from './generate-invoice.dto'
import Id from '../../../@shared/domain/value-object/id.value-object'
import Product from '../../domain/entity/product.entity'
import Address from '../../domain/value-object/address.value-object'
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

const MockRepository = () => {
  return {
    generate: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    find: jest.fn()
  }
}

describe('Generate Invoice useCase unit test', () => {
  it('should be able to generate a Invoice', async () => {
    const invoiceRepository = MockRepository()
    const useCase = new GenerateInvoiceUseCase(invoiceRepository)

    const input: GenerateInvoiceUseCaseInputDto = {
      name: invoice.name,
      document: invoice.document,
      street: address.street,
      number: address.number,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      complement: address.complement,
      items: [
        {
          id: product1.id.id,
          name: product1.name,
          price: product1.price
        },
        {
          id: product2.id.id,
          name: product2.name,
          price: product2.price
        }
      ]
    }

    const result = await useCase.execute(input)

    expect(invoiceRepository.generate).toHaveBeenCalled()
    expect(result.id).toBeDefined()

    expect(result.name).toEqual(input.name)
    expect(result.city).toEqual(input.city)
    expect(result.complement).toEqual(input.complement)
    expect(result.document).toEqual(input.document)
    expect(result.number).toEqual(input.number)
    expect(result.state).toEqual(input.state)
    expect(result.street).toEqual(input.street)
    expect(result.total).toBe(1200)

    expect(result.items.length).toBe(2)
    expect(result.items[0].id).toEqual('1')
    expect(result.items[0].name).toEqual('Product 1')
    expect(result.items[0].price).toBe(200)

    expect(result.items.length).toBe(2)
    expect(result.items[1].id).toEqual('2')
    expect(result.items[1].name).toEqual('Product 2')
    expect(result.items[1].price).toBe(1000)
  })
})
