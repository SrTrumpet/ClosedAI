import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración CORS más específica
  app.enableCors({
    origin: true, 
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'Access-Control-Allow-Headers', 
      'Origin', 
      'X-Requested-With'
    ],
  });

  // Añade soporte para WebSocket (necesario para suscripciones)
  app.useWebSocketAdapter(new WsAdapter(app));

  await app.listen(3000);
}
bootstrap();
