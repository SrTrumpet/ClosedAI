import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SubjectModule } from './subject/subject.module';
import { AsistModule } from './asist/asist.module';
import { AdvicesModule } from './advices/advices.module';
import { CourseModule } from './course/course.module';
import { SemesterModule } from './semester/semester.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { FormsModule } from './form/forms.module';
import { GradesModule } from './grades/grades.module';
import { PubSub } from 'graphql-subscriptions';
import { EventsModule } from './events/events.module';
import { ResponsesModule } from './form/response.module';
import { ChatsModule } from './chats/chat.module';


@Module({
  imports: [
    AdvicesModule,
    UserModule,
    AuthModule,
    AsistModule,
    SubjectModule,
    GradesModule,
    FormsModule,
    ResponsesModule,
    EventsModule,
    ChatsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3308,
      database: 'db_crud',
      username: 'crud_db',
      password: 'root',
      autoLoadEntities: true,
      synchronize: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: {
        path: join(process.cwd(), 'src', 'graphql', 'schema.gql'),
      },
      playground: true,
      context: ({ req, connection }) => ({
        req,
        ...(connection ? connection.context : {}),
      }),
    }),
  ],
  providers: [
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),  // Proveedor del PubSub para las suscripciones
    },
  ],
})
export class AppModule {}
