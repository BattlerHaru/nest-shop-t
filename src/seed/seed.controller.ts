import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// import { Auth } from '../auth/decorators/index';
// import { ValidRoles }s from 'src/auth/interfaces/index';
import { SeedService } from './seed.service';

@ApiTags( "Seed" )
@Controller( 'seed' )
export class SeedController {
    constructor( private readonly seedService: SeedService ) { }

    @Get()
    //   @Auth( ValidRoles.admin )
    executeSeed() {
        return this.seedService.runSeed();
    }

}
