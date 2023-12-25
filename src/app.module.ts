import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApiModule } from './api/api.module';
import { ChromaticModule } from './chromatic/chromatic.module';
import { GitlabApiModule } from './gitlab-api/gitlab-api.module';

@Module({
  imports: [ ApiModule, ChromaticModule, GitlabApiModule ],
  controllers: [ AppController ],
  providers: [],
})
export class AppModule {}
