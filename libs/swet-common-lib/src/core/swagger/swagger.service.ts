import { Logger, type INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerConfig } from '../../config/swagger.config';

export class SwaggerService {
  private static readonly logger = new Logger(SwaggerService.name);

  static setup(app: INestApplication, config: SwaggerConfig): void {
    if (!config.enabled) {
      this.logger.log('Swagger disabled');
      return;
    }

    const documentConfig = new DocumentBuilder()
      .setTitle(config.title)
      .setDescription(config.description)
      .setVersion(config.version)
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token',
        },
        'JWT-auth',
      )
      .build();

    const document = SwaggerModule.createDocument(app, documentConfig);

    SwaggerModule.setup(config.path, app, document, {
      swaggerOptions: {
        defaultModelsExpandDepth: -1,
        displayRequestDuration: true,
        docExpansion: 'none',
        operationsSorter: 'method',
        tagsSorter: 'alpha',
        syntaxHighlight: true,
        ['syntaxHighlight.activated']: 'obsidian',
        tryItOutEnabled: true,
        defaultModelRendering: 'model',
        defaultModelExpandDepth: -1,
        persistAuthorization: true,
      },
    });

    this.logger.log(`Swagger available at /${config.path}`);
  }
}
