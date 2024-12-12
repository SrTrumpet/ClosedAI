import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración global de CORS
  app.enableCors({
    origin: '*',  // Permite todas las conexiones
    credentials: true,  // Asegura que se manejen las credenciales (cookies, cabeceras, etc.)
  });


  // Inicialización del servidor y habilitación de WebSocket para suscripciones
  await app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
  });
}

bootstrap();
