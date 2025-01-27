import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto/index';

@Controller( 'auth' )
export class AuthController {
  constructor( private readonly authService: AuthService ) { }

  @Post( 'signup' )
  create( @Body() createUserDto: CreateUserDto ) {
    return this.authService.create( createUserDto );
  }

  @Post( 'signin' )
  login( @Body() loginUserDto: LoginUserDto ) {
    return this.authService.login( loginUserDto );
  }

  @Get( 'private' )
  @UseGuards( AuthGuard() )
  testingPrivateRoute() {
    return {
      ok: true,
      message: "Hola desde Private"
    };
  }
}
