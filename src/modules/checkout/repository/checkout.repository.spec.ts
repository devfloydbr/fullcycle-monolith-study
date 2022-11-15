import { Sequelize } from 'sequelize-typescript'
import Id from '../../@shared/domain/value-object/id.value-object'

import ProductModel from './product.model'

import OrderModel from './order.model'
import ClientModel from './client.model'
import Product from '../domain/product.entity'
import Address from '../../invoice/domain/value-object/address.value-object'
import Client from '../domain/client.entity'
import Order from '../domain/order.entity'
import CheckoutRepository from './checkout.repository'

const product1 = new Product({
  id: new Id('1'),
  name: 'Product 1',
  description: 'Description',
  salesPrice: 200
})

const product2 = new Product({
  id: new Id('2'),
  name: 'Product 2',
  description: 'Description',
  salesPrice: 150
})

const address = new Address({
  street: 'Street',
  number: 0,
  complement: '',
  city: 'City',
  state: 'State',
  zipCode: '00000-000'
})

const client = new Client({
  id: new Id('1'),
  name: 'Client',
  email: 'test@test.com',
  document: '000.000.000-00',
  address
})

const order = new Order({
  id: new Id('1'),
  client,
  products: [product1, product2],
  status: 'pending'
})

describe('Checkout Repository unit test', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([OrderModel, ClientModel, ProductModel])

    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('Should be able to place an order', async () => {
    const checkoutRepository = new CheckoutRepository()

    await ClientModel.create({
      id: client.id.id,
      name: client.name,
      email: client.email,
      document: client.document,
      street: address.street,
      number: address.number,
      complement: address.complement,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    await checkoutRepository.addOrder(order)

    const result = await OrderModel.findOne({
      where: { id: order.id.id },
      include: ['items']
    })

    expect(result.toJSON()).toStrictEqual({
      id: order.id.id,
      client_id: client.id.id,
      items: [
        {
          id: product1.id.id,
          order_id: order.id.id,
          name: product1.name,
          description: product1.description,
          salesPrice: product1.salesPrice
        },
        {
          id: product2.id.id,
          order_id: order.id.id,
          name: product2.name,
          description: product2.description,
          salesPrice: product2.salesPrice
        }
      ],
      status: order.status
    })
  })

  it('Should be able to find a invoice', async () => {
    const checkoutRepository = new CheckoutRepository()

    await ClientModel.create({
      id: client.id.id,
      name: client.name,
      email: client.email,
      document: client.document,
      street: address.street,
      number: address.number,
      complement: address.complement,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      createdAt: new Date(),
      updatedAt: new Date()
    })

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

    const result = await checkoutRepository.findOrder(order.id.id)

    expect(result.id.id).toEqual(order.id.id)
    expect(result.client.id.id).toEqual(client.id.id)
    expect(result.client.name).toEqual(client.name)
    expect(result.client.email).toEqual(client.email)
    expect(result.client.document).toEqual(client.document)
    expect(result.client.address.street).toEqual(address.street)
    expect(result.client.address.number).toEqual(address.number)
    expect(result.client.address.complement).toEqual(address.complement)
    expect(result.client.address.city).toEqual(address.city)
    expect(result.client.address.state).toEqual(address.state)
    expect(result.client.address.zipCode).toEqual(address.zipCode)

    expect(result.products.length).toBe(2)

    expect(result.products[0].id.id).toEqual(product1.id.id)
    expect(result.products[0].name).toEqual(product1.name)
    expect(result.products[0].description).toEqual(product1.description)
    expect(result.products[0].salesPrice).toEqual(product1.salesPrice)

    expect(result.products[1].id.id).toEqual(product2.id.id)
    expect(result.products[1].name).toEqual(product2.name)
    expect(result.products[1].description).toEqual(product1.description)
    expect(result.products[1].salesPrice).toEqual(product2.salesPrice)
  })
})
