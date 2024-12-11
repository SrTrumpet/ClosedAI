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

  // Habilitar el uso de la validación global de los DTOs
  app.useGlobalPipes(new ValidationPipe({
    transform: true,  // Convierte los datos entrantes a su tipo correcto
    whitelist: true,  // Elimina cualquier propiedad no definida en los DTOs
    forbidNonWhitelisted: true,  // Lanza un error si se encuentra propiedades no permitidas
  }));

  // Inicialización del servidor y habilitación de WebSocket para suscripciones
  await app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
  });
}

bootstrap();
