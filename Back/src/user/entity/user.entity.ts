import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserRoles } from '../enums/user-roles.enums';
import { MessageEntity } from 'src/messages/entities/message.entity';

@ObjectType()
@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Column()
    @Field()
    firstName: string;

    @Column()
    @Field()
    lastName: string;

    @Column()
    @Field()
    rut: string;

    @Column()
    @Field()
    email: string;

    @Column({
        type: "enum",
        enum: UserRoles,
        default: UserRoles.Student,
    })
    @Field(() => UserRoles)
    role: UserRoles;

    // Nuevas relaciones con mensajes
    @OneToMany(() => MessageEntity, message => message.sender)
    @Field(() => [MessageEntity], { nullable: true })
    sentMessages: MessageEntity[];

    @OneToMany(() => MessageEntity, message => message.receiver)
    @Field(() => [MessageEntity], { nullable: true })
    receivedMessages: MessageEntity[];
}
