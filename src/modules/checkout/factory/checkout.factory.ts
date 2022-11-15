import CheckoutRepository from '../repository/checkout.repository'
import PlaceOrderUseCase from '../usecase/place-order/place-order.usecase'
import ClientAdmFacade from '../../client-adm/facade/client-adm.facade'
import FindClientUseCase from '../../client-adm/usecase/find-client/find-client.usecase'
import AddClientUseCase from '../../client-adm/usecase/add-client/add-client.usecase'
import CheckoutFacade from '../facade/checkout.facade'
import ProductAdmFacade from '../../product-adm/facade/product-adm.facade'
import AddProductUseCase from '../../product-adm/usecase/add-product/add-product.usecase'
import CheckStockUseCase from '../../product-adm/usecase/check-stock/check-stock.usecase'
import StoreCatalogFacade from '../../store-catalog/facade/store-catalog.facade'
import FindProductUseCase from '../../store-catalog/usecase/find-product/find-product.usecase'
import InvoiceFacade from '../../invoice/facade/invoice.facade'
import PaymentFacade from '../../payment/facade/payment.facade'
import ClientRepository from '../../client-adm/repository/client.repository'
import ProductRepository from '../../product-adm/repository/product.repository'
import { ProductRepository as StoreCatalogProductRepository } from '../../store-catalog/repository/product.repository'

export default class CheckoutFacadeFactory {
  static create() {
    const checkoutRepository = new CheckoutRepository()
    const clientAdmRepository = new ClientRepository()
    const productAdmRepository = new ProductRepository()
    const storeCatalogRepository = new StoreCatalogProductRepository()

    const findClientUseCase = new FindClientUseCase(clientAdmRepository)
    const addClientUseCase = new AddClientUseCase(clientAdmRepository)

    const clientFacade = new ClientAdmFacade({
      findUseCase: findClientUseCase,
      addUseCase: addClientUseCase
    })

    const addProductUseCase = new AddProductUseCase(productAdmRepository)
    const checkStockUseCase = new CheckStockUseCase(productAdmRepository)

    const productFacade = new ProductAdmFacade({
      addUseCase: addProductUseCase,
      stockUseCase: checkStockUseCase
    })

    const findStoreCatalogUseCase = new FindProductUseCase(
      storeCatalogRepository
    )

    const storeCatalogFacade = new StoreCatalogFacade({
      findUseCase: findStoreCatalogUseCase,
      findAllUseCase: undefined
    })

    const invoiceFacade = new InvoiceFacade({
      generateUseCase: undefined,
      findUseCase: undefined
    })

    const paymentFacade = new PaymentFacade({
      execute: undefined
    })

    const placeOrderUseCase = new PlaceOrderUseCase(
      clientFacade,
      productFacade,
      storeCatalogFacade,
      invoiceFacade,
      paymentFacade,
      checkoutRepository
    )

    return new CheckoutFacade({
      placeOrderUseCase
    })
  }
}
