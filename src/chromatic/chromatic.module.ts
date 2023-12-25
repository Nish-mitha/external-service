import { Module } from '@nestjs/common';
import { ChromaticService } from './chromatic.service';
import { GitlabApiModule } from 'src/gitlab-api/gitlab-api.module';

@Module({
  imports: [ GitlabApiModule ],
  providers: [ ChromaticService ],
  exports: [ ChromaticService ]
})
export class ChromaticModule {}
