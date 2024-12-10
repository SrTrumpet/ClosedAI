import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración CORS más específica
  app.enableCors({
    origin: '*', // Permitir conexiones desde cualquier origen, ajusta según sea necesario
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
  });

  // Habilitar WebSocket para GraphQL
  app.useWebSocketAdapter(new WsAdapter(app));

  // Escuchar en el puerto 3000
  await app.listen(3000);
}
bootstrap();
