import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import InvoiceModel from './invoice.model'

@Table({
  tableName: 'invoice_products',
  timestamps: false
})
export default class ProductModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string

  @ForeignKey(() => InvoiceModel)
  @Column
  invoice_id: string

  @BelongsTo(() => InvoiceModel)
  invoice: Awaited<InvoiceModel>

  @Column({ allowNull: false })
  name: string

  @Column({ allowNull: false })
  price: number
}
