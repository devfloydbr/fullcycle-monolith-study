import { Sequelize } from 'sequelize-typescript'
import Id from '../../@shared/domain/value-object/id.value-object'
import Client from '../domain/client.entity'
import { ClientModel } from './client.model'
import ClientRepository from './client.repository'
import Address from '../../invoice/domain/value-object/address.value-object'

describe('ClientRepository test', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    await sequelize.addModels([ClientModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should create a client', async () => {
    const client = new Client({
      id: new Id('1'),
      name: 'Client 1',
      email: 'x@x.com',
      document: '000.000.000-00',
      address: new Address({
        street: 'Street',
        number: 0,
        complement: '',
        city: 'City',
        state: 'State',
        zipCode: '00000-000'
      })
    })

    const repository = new ClientRepository()
    await repository.add(client)

    const clientDb = await ClientModel.findOne({ where: { id: '1' } })

    expect(clientDb).toBeDefined()
    expect(clientDb.id).toEqual(client.id.id)
    expect(clientDb.name).toEqual(client.name)
    expect(clientDb.email).toEqual(client.email)
    expect(clientDb.document).toEqual(client.document)
    expect(clientDb.street).toEqual(client.address.street)
    expect(clientDb.number).toEqual(client.address.number)
    expect(clientDb.complement).toEqual(client.address.complement)
    expect(clientDb.city).toEqual(client.address.city)
    expect(clientDb.state).toEqual(client.address.state)
    expect(clientDb.zipCode).toEqual(client.address.zipCode)
    expect(clientDb.createdAt).toStrictEqual(client.createdAt)
    expect(clientDb.updatedAt).toStrictEqual(client.updatedAt)
  })

  it('should find a client', async () => {
    const client = await ClientModel.create({
      id: new Id('1').id,
      name: 'Client 1',
      email: 'x@x.com',
      document: '000.000.000-00',
      street: 'Street',
      number: 0,
      complement: '',
      city: 'City',
      state: 'State',
      zipCode: '00000-000',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const repository = new ClientRepository()

    const result = await repository.find(client.id)

    expect(result.id.id).toEqual(client.id)
    expect(result.name).toEqual(client.name)
    expect(result.email).toEqual(client.email)
    expect(result.document).toEqual(client.document)
    expect(result.address.street).toEqual(client.street)
    expect(result.address.number).toEqual(client.number)
    expect(result.address.complement).toEqual(client.complement)
    expect(result.address.city).toEqual(client.city)
    expect(result.address.state).toEqual(client.state)
    expect(result.address.zipCode).toEqual(client.zipCode)
    expect(result.createdAt).toStrictEqual(client.createdAt)
    expect(result.updatedAt).toStrictEqual(client.updatedAt)
  })
})
