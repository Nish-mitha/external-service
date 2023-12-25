import { Module } from '@nestjs/common';
import { GitlabApiService } from './gitlab-api.service';
import { ApiModule } from 'src/api/api.module';

@Module({
  imports: [ ApiModule ],
  providers: [ GitlabApiService ],
  exports: [ GitlabApiService ]
})
export class GitlabApiModule {}
