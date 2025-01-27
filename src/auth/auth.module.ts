import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';

@Module( {
  controllers: [ AuthController ],
  providers: [ AuthService ],
  imports: [
    TypeOrmModule.forFeature( [
      User,
    ] ),
    PassportModule.register( { defaultStrategy: 'jwt' } ),
  ],
  exports: [ TypeOrmModule ]
} )
export class AuthModule { }
