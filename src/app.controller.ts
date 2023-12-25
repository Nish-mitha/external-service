import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChromaticService } from './chromatic/chromatic.service';

@Controller()
export class AppController {
  constructor(private readonly chromaticService: ChromaticService) {}

  @Post('chromatic')
  async handleWebhook(@Body() payload: any): Promise<string> {

    /**
     * Validate the payload
     */
    if (Object.keys(payload).length === 0) {
      return 'Invalid payload';
    }

    /**
     * Verify chromatic event
     */
    switch (payload['event']) {
      case 'build':
        await this.chromaticService.buildUpdates(payload['build']);
        break;
      case 'review':
        await this.chromaticService.reviewUpdates(payload['review']);
        break;
      case 'review-decision':
        await this.chromaticService.reviewDecisions(payload['reviewDecision']);
        break;
      default:
        console.log(`This webhook event is not handled`);
    }
  }
}
