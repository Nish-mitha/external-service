import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApiModule } from './api/api.module';
import { ChromaticModule } from './chromatic/chromatic.module';

@Module({
  imports: [ ApiModule, ChromaticModule ],
  controllers: [ AppController ],
  providers: [],
})
export class AppModule {}
