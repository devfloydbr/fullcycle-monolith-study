import Id from '../../../@shared/domain/value-object/id.value-object'
import Address from '../../../invoice/domain/value-object/address.value-object'
import Client from '../../domain/client.entity'
import FindClientUseCase from './find-client.usecase'

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

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(client))
  }
}

describe('FindClientUseCase unit test', () => {
  it('Should be able to find a client', async () => {
    const repository = MockRepository()
    const useCase = new FindClientUseCase(repository)

    const input = {
      id: '1'
    }

    const result = await useCase.execute(input)

    expect(repository.find).toHaveBeenCalled()
    expect(result.id).toEqual(input.id)
    expect(result.name).toEqual(client.name)
    expect(result.email).toEqual(client.email)
    expect(result.document).toEqual(client.document)
    expect(result.address).toEqual(client.address)
    expect(result.createdAt).toEqual(client.createdAt)
    expect(result.updatedAt).toEqual(client.updatedAt)
  })
})
