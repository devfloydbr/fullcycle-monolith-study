import AddClientUseCase from './add-client.usecase'
import { AddClientInputDto } from './add-client.usecase.dto'

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn()
  }
}

describe('Add Client UseCase unit test', () => {
  it('should add a client', async () => {
    const repository = MockRepository()
    const useCase = new AddClientUseCase(repository)

    const input: AddClientInputDto = {
      name: 'Client 1',
      email: 'x@x.com',
      street: 'Street',
      document: '000.000.000-00',
      number: 0,
      complement: '',
      city: 'City',
      state: 'State',
      zipCode: '00000-000'
    }

    const result = await useCase.execute(input)

    expect(repository.add).toHaveBeenCalled()
    expect(result.id).toBeDefined()
    expect(result.name).toEqual(input.name)
    expect(result.email).toEqual(input.email)
    expect(result.document).toEqual(input.document)
    expect(result.address.street).toEqual(input.street)
    expect(result.address.number).toEqual(input.number)
    expect(result.address.complement).toEqual(input.complement)
    expect(result.address.city).toEqual(input.city)
    expect(result.address.state).toEqual(input.state)
    expect(result.address.zipCode).toEqual(input.zipCode)
  })
})
