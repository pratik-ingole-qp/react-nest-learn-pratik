import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn} from 'typeorm'

@Entity({name: 'todo'})
export class TodoEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({length: 256, type: 'varchar', nullable: false})
  title: string

  @Column({type: 'boolean', default: false})
  isDeleted: boolean

  @CreateDateColumn()
  createdAt: Date
}
