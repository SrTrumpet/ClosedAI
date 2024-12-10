import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Form } from './form.entity';

@Entity('responses')
export class Response {
  @PrimaryGeneratedColumn('uuid', { comment: 'Unique identifier for the response' })
  id: string;

  @ManyToOne(() => Form, (form) => form.id, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'form_id' }) // Define el nombre de la columna para mayor claridad.
  form: Form;

  @Column('json', { comment: 'Stores answers as a JSON object' }) // Cambiar a 'json' si usas MySQL.
  answers: Record<string, any>;

  @CreateDateColumn({ comment: 'Date when the response was submitted' })
  submittedAt: Date;
}
