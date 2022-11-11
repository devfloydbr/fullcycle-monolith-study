import { Sequelize } from 'sequelize-typescript'

import InvoiceModel from '../repository/invoice.model'
import InvoiceRepository from '../repository/invoice.repository'
import GenerateInvoiceUseCase from '../usecase/generate-invoice/generate-invoice.usecase'
import InvoiceFacade from './invoice.facade'
import Product from '../domain/entity/product.entity'
import Id from '../../@shared/domain/value-object/id.value-object'
import Address from '../domain/value-object/address.value-object'
import Invoice from '../domain/entity/invoice.entity'
import ProductModel from '../repository/product.model'
import InvoiceFacadeFactory from '../factory/invoice.facade.factory'
import FindInvoiceUseCase from '../usecase/find-invoice/find-invoice.usecase'

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
  address: address,
  items: [product1, product2]
})

describe('InvoiceFacade unit test', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([InvoiceModel, ProductModel])

    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('Should be able to create a invoice', async () => {
    const repository = new InvoiceRepository()
    const generateUseCase = new GenerateInvoiceUseCase(repository)

    const facade = new InvoiceFacade({
      generateUseCase,
      findUseCase: undefined
    })

    await facade.generate({
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: address.street,
      number: address.number,
      complement: address.complement,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
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
    })

    const findInvoice = await InvoiceModel.findOne({
      where: { id: invoice.id.id },
      include: ['items']
    })

    expect(findInvoice.id).toBe(invoice.id.id)
    expect(findInvoice.name).toBe(invoice.name)
    expect(findInvoice.document).toBe(invoice.document)
    expect(findInvoice.items.length).toBe(2)
  })

  it('Should be able to find a invoice', async () => {
    const repository = new InvoiceRepository()

    const findUseCase = new FindInvoiceUseCase(repository)

    const factory = InvoiceFacadeFactory.create()

    const facade = new InvoiceFacade({
      generateUseCase: undefined,
      findUseCase
    })

    await factory.generate({
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: address.street,
      number: address.number,
      complement: address.complement,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
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
    })

    const findInvoice = await facade.find({ id: invoice.id.id })

    expect(findInvoice).toBeDefined()
    expect(findInvoice.id).toBe(invoice.id.id)
    expect(findInvoice.name).toBe(invoice.name)
    expect(findInvoice.document).toBe(invoice.document)
  })
})
