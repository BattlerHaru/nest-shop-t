import { Controller, Get } from '@nestjs/common';
import { Auth } from '../auth/decorators/index';
import { ValidRoles } from 'src/auth/interfaces/index';
import { SeedService } from './seed.service';

@Controller( 'seed' )
export class SeedController {
    constructor( private readonly seedService: SeedService ) { }

    @Get()
    //   @Auth( ValidRoles.admin )
    executeSeed() {
        return this.seedService.runSeed();
    }

}
