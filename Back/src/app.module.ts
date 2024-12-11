import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SubjectModule } from './subject/subject.module';
import { AsistModule } from './asist/asist.module';
import { AdvicesModule } from './advices/advices.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { GradesModule } from './grades/grades.module';
import { PubSub } from 'graphql-subscriptions';
import { FormsModule } from './form/forms.module';
import { ResponsesModule } from './form/response.module';

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

      // Configuración para WebSocket y suscripciones
      subscriptions: {
        'graphql-ws': { // WebSocket GraphQL subscriptions (Apollo Server 3.x+)
          path: '/graphql',
        },
        'subscriptions-transport-ws': { // Legacy WebSocket transport para compatibilidad
          path: '/graphql',
        },
      },
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
