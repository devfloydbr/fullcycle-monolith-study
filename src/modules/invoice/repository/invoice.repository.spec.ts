import { Sequelize } from 'sequelize-typescript'
import Id from '../../@shared/domain/value-object/id.value-object'

import Address from '../domain/value-object/address.value-object'
import InvoiceModel from './invoice.model'

import InvoiceRepository from './invoice.repository'
import ProductModel from './product.model'
import Product from '../domain/entity/product.entity'
import Invoice from '../domain/entity/invoice.entity'

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

describe('Invoice Repository unit test', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([ProductModel, InvoiceModel])

    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('Should be able to create a invoice', async () => {
    const invoiceRepository = new InvoiceRepository()
    await invoiceRepository.generate(invoice)

    const result = await InvoiceModel.findOne({
      where: { id: invoice.id.id },
      include: ['items']
    })

    expect(result.toJSON()).toStrictEqual({
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
          invoice_id: invoice.id.id,
          id: product1.id.id,
          name: product1.name,
          price: product1.price
        },
        {
          invoice_id: invoice.id.id,
          id: product2.id.id,
          name: product2.name,
          price: product2.price
        }
      ],
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt
    })
  })

  it('Should be able to find a invoice', async () => {
    const invoiceRepository = new InvoiceRepository()
    await invoiceRepository.generate(invoice)

    const result = await invoiceRepository.find(invoice.id.id)

    expect(result.id.id).toEqual(invoice.id.id)
    expect(result.name).toEqual(invoice.name)
    expect(result.document).toEqual(invoice.document)
    expect(result.address.street).toEqual(address.street)
    expect(result.address.complement).toEqual(address.complement)
    expect(result.address.number).toEqual(address.number)
    expect(result.address.city).toEqual(address.city)
    expect(result.address.state).toEqual(address.state)
    expect(result.address.zipCode).toEqual(address.zipCode)

    expect(result.items.length).toBe(2)

    expect(result.items[0].id.id).toEqual(product1.id.id)
    expect(result.items[0].name).toEqual(product1.name)
    expect(result.items[0].price).toEqual(product1.price)

    expect(result.items[1].id.id).toEqual(product2.id.id)
    expect(result.items[1].name).toEqual(product2.name)
    expect(result.items[1].price).toEqual(product2.price)
  })
})
