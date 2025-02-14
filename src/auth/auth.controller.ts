import { Controller, Post, Body, Get, UseGuards, Headers } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IncomingHttpHeaders } from 'http';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto/index';
import { Auth, GetUser, RawHeaders } from './decorators/index';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';

@ApiTags( 'Auth' )
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

    @Get( 'check-status' )
    @Auth()
    checkAuthStatus(
        @GetUser() user: User
    ) {
        return this.authService.checkAuthStatus( user );
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

    @Get( 'private2' )
    @RoleProtected( ValidRoles.superUser, ValidRoles.admin )
    // @SetMetadata( 'roles', [ "admin", "super-user" ] )
    @UseGuards( AuthGuard(), UserRoleGuard )
    privateRoute2(
        @GetUser() user: User,

    ) {
        return {
            ok: true,
            user
        };
    }


    @Get( 'private3' )
    @Auth( ValidRoles.superUser, ValidRoles.admin )
    privateRout3(
        @GetUser() user: User,
    ) {
        return {
            ok: true,
            user
        };
    }
}
