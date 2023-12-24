import { Module } from '@nestjs/common';
import { ChromaticService } from './chromatic.service';
import { ApiModule } from 'src/api/api.module';

@Module({
  imports: [ ApiModule ],
  providers: [ ChromaticService ],
  exports: [ ChromaticService ]
})
export class ChromaticModule {}
