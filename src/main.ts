import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';


async function bootstrap() {
    const app = await NestFactory.create( AppModule );
    const logger = new Logger( 'bootstrap' );

    app.enableCors();

    app.setGlobalPrefix( 'api' );
    app.useGlobalPipes(
        new ValidationPipe( {
            whitelist: true,
            forbidNonWhitelisted: true,

        } )
    );

    const config = new DocumentBuilder()
        .setTitle( 'shop-t RESTFul API' )
        .setDescription( 'shop-t shop endpoints' )
        .setVersion( '1.0' )
        .build();
    const document = SwaggerModule.createDocument( app, config );
    SwaggerModule.setup( 'api', app, document );



    await app.listen( process.env.PORT );
    logger.log( `App running on port ${ process.env.PORT }` );
}
bootstrap();
