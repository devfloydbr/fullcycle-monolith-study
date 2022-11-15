import UseCaseInterface from '../../@shared/usecase/use-case.interface'
import CheckoutFacadeInterface, {
  PlaceOrderCheckoutFacadeInputDto,
  PlaceOrderCheckoutFacadeOutputDto
} from './checkout.facade.interface'

export interface UseCaseProps {
  placeOrderUseCase: UseCaseInterface
}

export default class CheckoutFacade implements CheckoutFacadeInterface {
  private _placeOrderUseCase: UseCaseInterface

  constructor(useCaseProps: UseCaseProps) {
    this._placeOrderUseCase = useCaseProps.placeOrderUseCase
  }

  async placeOrder(
    input: PlaceOrderCheckoutFacadeInputDto
  ): Promise<PlaceOrderCheckoutFacadeOutputDto> {
    return await this._placeOrderUseCase.execute(input)
  }
}
