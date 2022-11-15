import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import OrderModel from './order.model'

@Table({
  tableName: 'order_products',
  timestamps: false
})
export default class ProductModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string

  @ForeignKey(() => OrderModel)
  @Column
  order_id: string

  @BelongsTo(() => OrderModel)
  order: Awaited<OrderModel>

  @Column({ allowNull: false })
  name: string

  @Column({ allowNull: false })
  description: string

  @Column({ allowNull: false, type: DataType.DECIMAL })
  salesPrice: number
}
