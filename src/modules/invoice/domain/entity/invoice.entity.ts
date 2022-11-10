import BaseEntity from '../../../@shared/domain/entity/base.entity'
import AggregateRoot from '../../../@shared/domain/entity/aggregate-root.interface'
import Id from '../../../@shared/domain/value-object/id.value-object'
import Address from '../value-object/address.value-object'
import Product from './product.entity'

type InvoiceProps = {
  id?: Id
  name: string
  document: string
  address: Address
  items: Product[]
  createdAt?: Date
  updatedAt?: Date
}

export default class Invoice extends BaseEntity implements AggregateRoot {
  private readonly _name: string
  private readonly _document: string
  private readonly _address: Address
  private readonly _items: Product[]

  constructor(props: InvoiceProps) {
    super(props.id, props.createdAt, props.updatedAt)

    this._name = props.name
    this._document = props.document
    this._address = props.address
    this._items = props.items
  }

  get name(): string {
    return this._name
  }

  get document(): string {
    return this._document
  }

  get address(): Address {
    return this._address
  }

  get items(): Product[] {
    return this._items
  }

  total(): number {
    return this._items.reduce((acc, product) => {
      return acc + product.price
    }, 0)
  }
}
