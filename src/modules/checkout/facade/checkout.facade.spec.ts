import { Sequelize } from 'sequelize-typescript'

import ProductModel from '../repository/product.model'
import ClientModel from '../repository/client.model'
import OrderModel from '../repository/order.model'

describe('CheckoutFacade unit test', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([ClientModel, ProductModel, OrderModel])

    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('Should be able to place an order', async () => {})
})
