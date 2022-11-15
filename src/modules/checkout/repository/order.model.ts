import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import ClientModel from './client.model'
import ProductModel from './product.model'

@Table({
  tableName: 'orders',
  timestamps: false
})
export default class OrderModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string

  @HasMany(() => ProductModel)
  items: ProductModel[]

  @ForeignKey(() => ClientModel)
  @Column
  client_id: string

  @BelongsTo(() => ClientModel)
  client: Awaited<ClientModel>

  @Column({ allowNull: false })
  status: string
}
