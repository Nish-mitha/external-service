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
        this.chromaticService.reviewUpdates(payload['review']);
        break;
      case 'review-decision':
        this.chromaticService.reviewDecisions(payload);
        break;
      default:
        console.log(`This webhook event is not handled`);
    }
    return 'Webhook received successfully';
  }
}
