import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Link } from './link.model';

@Table({
  tableName: 'telegraf-sessions',
})
export class Session extends Model<Session> {
  @PrimaryKey
  @Column({
    type: DataType.STRING(32),
    allowNull: false,
  })
  key: string;

  @Column(DataType.TEXT)
  session: string;

  @HasMany(() => Link, {
    foreignKey: 'session_key',
    sourceKey: 'key',
  })
  links: Link[];
}
