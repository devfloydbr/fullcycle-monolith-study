import { Sequelize } from 'sequelize-typescript'
import ClientAdmFacadeFactory from '../factory/client-adm.facade.factory'
import { ClientModel } from '../repository/client.model'
import ClientRepository from '../repository/client.repository'
import AddClientUseCase from '../usecase/add-client/add-client.usecase'
import ClientAdmFacade from './client-adm.facade'
import { AddClientInputDto } from '../usecase/add-client/add-client.usecase.dto'

describe('ClientAdmFacade test', () => {
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
    const repository = new ClientRepository()

    const addUseCase = new AddClientUseCase(repository)

    const facade = new ClientAdmFacade({
      addUseCase,
      findUseCase: undefined
    })

    const input: AddClientInputDto = {
      id: '1',
      name: 'Client 1',
      email: 'x@x.com',
      document: '000.000.000-00',
      street: 'Street',
      number: 0,
      complement: '',
      city: 'City',
      state: 'State',
      zipCode: '00000-000'
    }

    await facade.add(input)

    const client = await ClientModel.findOne({ where: { id: '1' } })

    expect(client).toBeDefined()
    expect(client.name).toEqual(input.name)
    expect(client.email).toEqual(input.email)
    expect(client.document).toEqual(input.document)
    expect(client.street).toEqual(input.street)
    expect(client.number).toEqual(input.number)
    expect(client.complement).toEqual(input.complement)
    expect(client.city).toEqual(input.city)
    expect(client.state).toEqual(input.state)
    expect(client.zipCode).toEqual(input.zipCode)
  })

  it('should find a client', async () => {
    const facade = ClientAdmFacadeFactory.create()

    const input: AddClientInputDto = {
      id: '1',
      name: 'Client 1',
      email: 'x@x.com',
      document: '000.000.000-00',
      street: 'Street',
      number: 0,
      complement: '',
      city: 'City',
      state: 'State',
      zipCode: '00000-000'
    }

    await facade.add(input)

    const client = await facade.find({ id: '1' })

    expect(client).toBeDefined()
    expect(client.id).toEqual(input.id)
    expect(client.name).toEqual(input.name)
    expect(client.email).toEqual(input.email)
    expect(client.document).toEqual(input.document)
    expect(client.address.street).toEqual(input.street)
    expect(client.address.number).toEqual(input.number)
    expect(client.address.complement).toEqual(input.complement)
    expect(client.address.city).toEqual(input.city)
    expect(client.address.state).toEqual(input.state)
    expect(client.address.zipCode).toEqual(input.zipCode)
  })
})
