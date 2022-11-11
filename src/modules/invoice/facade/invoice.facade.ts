import UseCaseInterface from '../../@shared/usecase/use-case.interface'

import InvoiceFacadeInterface, {
  FindInvoiceFacadeInputDto,
  FindInvoiceFacadeOutputDto,
  GenerateInvoiceFacadeInputDto
} from './invoice.facade.interface'

export interface UseCaseProps {
  findUseCase: UseCaseInterface
  generateUseCase: UseCaseInterface
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
  private _findUseCase: UseCaseInterface
  private _generateUseCase: UseCaseInterface

  constructor(useCaseProps: UseCaseProps) {
    this._findUseCase = useCaseProps.findUseCase
    this._generateUseCase = useCaseProps.generateUseCase
  }

  async generate(input: GenerateInvoiceFacadeInputDto): Promise<void> {
    await this._generateUseCase.execute(input)
  }
  async find(
    input: FindInvoiceFacadeInputDto
  ): Promise<FindInvoiceFacadeOutputDto> {
    return await this._findUseCase.execute(input)
  }
}
