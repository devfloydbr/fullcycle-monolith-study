import PlaceOrderUseCase from './place-order.usecase'
import { PlaceOrderInputDto } from './place-order.dto'
import Product from '../../../store-catalog/domain/product.entity'
import Id from '../../../@shared/domain/value-object/id.value-object'
import { FindClientFacadeOutputDto } from '../../../client-adm/facade/client-adm.facade.interface'

const mockDate = new Date(2000, 1, 1)

describe('PlaceOrderUseCase unit test', () => {
  describe('Method -> validateProducts()', () => {
    //@ts-expect-error - no params in constructor
    const placeOrderUseCase = new PlaceOrderUseCase()

    it('Should throw an error products are not provided', async () => {
      const input: PlaceOrderInputDto = {
        clientId: '0',
        products: []
      }

      await expect(
        placeOrderUseCase['validateProducts'](input)
      ).rejects.toThrow(new Error('Products not provided.'))
    })

    it('Should throw an error products is out of stock', async () => {
      const mockProductFacade = {
        checkStock: jest.fn(({ productId }: { productId: string }) =>
          Promise.resolve({
            productId,
            stock: productId === '1' ? 0 : 1
          })
        )
      }

      //@ts-expect-error - force set productFacade
      placeOrderUseCase['_productFacade'] = mockProductFacade

      let input: PlaceOrderInputDto = {
        clientId: '0',
        products: [
          {
            productId: '1'
          }
        ]
      }

      await expect(
        placeOrderUseCase['validateProducts'](input)
      ).rejects.toThrow(new Error('Product 1 is not available in stock.'))

      input = {
        clientId: '0',
        products: [
          {
            productId: '0'
          },
          {
            productId: '1'
          }
        ]
      }

      await expect(
        placeOrderUseCase['validateProducts'](input)
      ).rejects.toThrow(new Error('Product 1 is not available in stock.'))

      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3)

      input = {
        clientId: '0',
        products: [
          {
            productId: '0'
          },
          {
            productId: '1'
          },
          {
            productId: '2'
          }
        ]
      }

      await expect(
        placeOrderUseCase['validateProducts'](input)
      ).rejects.toThrow(new Error('Product 1 is not available in stock.'))

      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5)
    })
  })

  describe('Method -> getProducts', () => {
    beforeAll(() => {
      jest.useFakeTimers('modern')
      jest.setSystemTime(mockDate)
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    //@ts-expect-error - no params in constructor
    const placeOrderUseCase = new PlaceOrderUseCase()

    it('Should throw an error when product not found', async () => {
      //@ts-expect-error - force set storeCatalogFacade
      placeOrderUseCase['_storeCatalogFacade'] = {
        find: jest.fn().mockResolvedValue(null)
      }

      await expect(placeOrderUseCase['getProduct']('0')).rejects.toThrow(
        new Error('Product not found.')
      )
    })

    it('Should be able to find a product', async () => {
      const input = {
        id: '1',
        name: 'Name',
        description: 'Description',
        salesPrice: 5
      }

      const mockStoreCaTalogFacade = {
        find: jest.fn().mockResolvedValue(input)
      }

      //@ts-expect-error - force set storeCatalogFacade
      placeOrderUseCase['_storeCatalogFacade'] = mockStoreCaTalogFacade

      await expect(placeOrderUseCase['getProduct']('1')).resolves.toEqual(
        new Product({
          id: new Id(input.id),
          name: input.name,
          description: input.description,
          salesPrice: input.salesPrice
        })
      )

      expect(mockStoreCaTalogFacade.find).toHaveBeenCalledTimes(1)
    })
  })

  describe('Method -> execute()', () => {
    beforeAll(() => {
      jest.useFakeTimers('modern')
      jest.setSystemTime(mockDate)
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    it('Should throw an error when client not found', async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(null)
      }

      //@ts-expect-error - no params in constructor
      const placeOrderUseCase = new PlaceOrderUseCase(mockClientFacade)
      //@ts-expect-error - force set clientFacade
      placeOrderUseCase['_clientFacade'] = mockClientFacade

      const input: PlaceOrderInputDto = {
        clientId: '0',
        products: []
      }

      await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
        new Error('Client not found.')
      )
    })

    it('Should throw an error when products are not valid', async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(true)
      }

      //@ts-expect-error - no params in constructor
      const placeOrderUseCase = new PlaceOrderUseCase(mockClientFacade)

      const mockValidateProducts = jest
        //@ts-expect-error - spy on private method
        .spyOn(placeOrderUseCase, 'validateProducts')
        //@ts-expect-error - not return never
        .mockRejectedValue(new Error('Products not provided.'))

      //@ts-expect-error - force set clientFacade
      placeOrderUseCase['_clientFacade'] = mockClientFacade

      const input: PlaceOrderInputDto = {
        clientId: '1',
        products: []
      }

      await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
        new Error('Products not provided.')
      )

      expect(mockValidateProducts).toHaveBeenCalledTimes(1)
    })

    describe('Place an Order', () => {
      const clientFacadeOutput: FindClientFacadeOutputDto = {
        id: '1',
        name: 'Client',
        email: 'test@test.com',
        document: '000.000.000-00',
        address: {
          street: 'Street',
          number: 0,
          complement: '',
          city: 'City',
          state: 'State',
          zipCode: '000000-000'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(clientFacadeOutput)
      }

      const mockPaymentFacade = {
        process: jest.fn()
      }

      const mockCheckoutRepository = {
        addOrder: jest.fn()
      }

      const mockInvoiceFacade = {
        generate: jest.fn().mockResolvedValue({ id: '1' })
      }

      const useCase = new PlaceOrderUseCase(
        mockClientFacade as any,
        null,
        null,
        mockInvoiceFacade as any,
        mockPaymentFacade,
        mockCheckoutRepository as any
      )

      const products = {
        '1': new Product({
          id: new Id('1'),
          name: 'Product 1',
          description: 'Description',
          salesPrice: 40
        }),
        '2': new Product({
          id: new Id('2'),
          name: 'Product 2',
          description: 'Description',
          salesPrice: 50
        })
      }

      const mockValidateProducts = jest
        //@ts-expect-error - spy on private method
        .spyOn(useCase, 'validateProducts')
        //@ts-expect-error - not return never
        .mockResolvedValue(null)

      const mockGetProduct = jest
        //@ts-expect-error - spy on private method
        .spyOn(useCase, 'getProduct')
        //@ts-expect-error - not return never
        .mockImplementation((productId: keyof typeof products) => {
          return products[productId]
        })

      it('Should not be approved', async () => {
        mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
          transactionId: '1',
          oderId: '1',
          amount: 100,
          status: 'error',
          createdAt: new Date(),
          updatedAt: new Date()
        })

        const input: PlaceOrderInputDto = {
          clientId: '1',
          products: [{ productId: '1' }, { productId: '2' }]
        }

        const output = await useCase.execute(input)

        expect(output.invoiceId).toBeNull()
        expect(output.total).toEqual(90)
        expect(output.products).toStrictEqual([
          { productId: '1' },
          { productId: '2' }
        ])
        expect(mockClientFacade.find).toHaveBeenCalledTimes(1)
        expect(mockClientFacade.find).toHaveBeenCalledWith({ id: '1' })
        expect(mockValidateProducts).toHaveBeenCalledTimes(1)
        expect(mockValidateProducts).toHaveBeenCalledWith(input)
        expect(mockGetProduct).toHaveBeenCalledTimes(2)
        expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1)
        expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1)
        expect(mockPaymentFacade.process).toHaveBeenCalledWith({
          orderId: output.id,
          amount: output.total
        })
        expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(0)
      })

      it('Should be approved', async () => {
        mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
          transactionId: '1',
          oderId: '1',
          amount: 100,
          status: 'approved',
          createdAt: new Date(),
          updatedAt: new Date()
        })

        const input: PlaceOrderInputDto = {
          clientId: '1',
          products: [{ productId: '1' }, { productId: '2' }]
        }

        const output = await useCase.execute(input)

        expect(output.invoiceId).toBe('1')
        expect(output.total).toEqual(90)
        expect(output.products).toStrictEqual([
          { productId: '1' },
          { productId: '2' }
        ])
        expect(mockClientFacade.find).toHaveBeenCalledTimes(1)
        expect(mockClientFacade.find).toHaveBeenCalledWith({ id: '1' })
        expect(mockValidateProducts).toHaveBeenCalledTimes(1)
        expect(mockValidateProducts).toHaveBeenCalledWith(input)
        expect(mockGetProduct).toHaveBeenCalledTimes(2)
        expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1)
        expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1)
        expect(mockPaymentFacade.process).toHaveBeenCalledWith({
          orderId: output.id,
          amount: output.total
        })
        expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(1)
        expect(mockInvoiceFacade.generate).toHaveBeenCalledWith({
          name: clientFacadeOutput.name,
          document: clientFacadeOutput.document,
          street: clientFacadeOutput.address.street,
          number: clientFacadeOutput.address.number,
          complement: clientFacadeOutput.address.complement,
          city: clientFacadeOutput.address.city,
          state: clientFacadeOutput.address.state,
          zipCode: clientFacadeOutput.address.zipCode,
          items: [
            {
              id: products['1'].id.id,
              name: products['1'].name,
              price: products['1'].salesPrice
            },
            {
              id: products['2'].id.id,
              name: products['2'].name,
              price: products['2'].salesPrice
            }
          ]
        })
      })
    })
  })
})
