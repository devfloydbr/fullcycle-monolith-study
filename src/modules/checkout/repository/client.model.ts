import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import OrderModel from './order.model'

@Table({
  tableName: 'clients',
  timestamps: false
})
export default class ClientModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string

  @HasMany(() => OrderModel)
  orders: OrderModel[]

  @Column({ allowNull: false })
  name: string

  @Column({ allowNull: false })
  email: string

  @Column({ allowNull: false })
  document: string

  @Column({ allowNull: false })
  street: string

  @Column({ allowNull: false, type: DataType.INTEGER })
  number: number

  @Column({ allowNull: false })
  complement: string

  @Column({ allowNull: false })
  city: string

  @Column({ allowNull: false })
  state: string

  @Column({ field: 'zip_code', allowNull: false })
  zipCode: string

  @Column({ allowNull: false })
  createdAt: Date

  @Column({ allowNull: false })
  updatedAt: Date
}
