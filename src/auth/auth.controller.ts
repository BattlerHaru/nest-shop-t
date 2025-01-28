import { Controller, Post, Body, Get, UseGuards, Headers } from '@nestjs/common';
import { IncomingHttpHeaders } from 'http';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto/index';
import { GetUser, RawHeaders } from './decorators/index';
import { User } from './entities/user.entity';

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
  testingPrivateRoute(
    // @Req() request: Express.Request
    @GetUser() user: User,
    @GetUser( "email" ) userEmail: string,
    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders
  ) {
    return {
      ok: true,
      message: "Hola desde Private",
      user,
      userEmail,
      rawHeaders,
      headers
    };
  }
}
