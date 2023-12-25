import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChromaticService } from './chromatic/chromatic.service';

@Controller()
export class AppController {
  constructor(private readonly chromaticService: ChromaticService) {}

  @Post('chromatic')
  async handleWebhook(@Body() payload: any): Promise<any> {

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
        return await this.chromaticService.buildUpdates(payload['build']);
      case 'review':
        return await this.chromaticService.reviewUpdates(payload['review']);
      case 'review-decision':
        return await this.chromaticService.reviewDecisions(payload['reviewDecision']);
      default:
        return `This webhook event is not handled`;
    }
  }
}
