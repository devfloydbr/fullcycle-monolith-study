import InvoiceRepository from '../repository/invoice.repository'
import GenerateInvoiceUseCase from '../usecase/generate-invoice/generate-invoice.usecase'
import FindInvoiceUseCase from '../usecase/find-invoice/find-invoice.usecase'
import InvoiceFacade from '../facade/invoice.facade'

export default class InvoiceFacadeFactory {
  static create() {
    const repository = new InvoiceRepository()
    const findUseCase = new FindInvoiceUseCase(repository)
    const generateUseCase = new GenerateInvoiceUseCase(repository)

    return new InvoiceFacade({
      generateUseCase: generateUseCase,
      findUseCase: findUseCase
    })
  }
}
