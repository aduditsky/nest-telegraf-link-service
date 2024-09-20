import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Session } from './session.model';

@Table
export class Link extends Model<Link> {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @ForeignKey(() => Session)
  @Column({
    type: DataType.STRING(32),
    allowNull: true,
  })
  session_key: string;
  @Column
  code: string;

  @Column
  name: string;

  @Column
  url: string;

  @BelongsTo(() => Session, 'session_key')
  session: Session;
}
