import { Injectable } from '@nestjs/common';
import { GitlabApiService } from 'src/gitlab-api/gitlab-api.service';
import { BuildStatus } from 'src/util';

@Injectable()
export class ChromaticService {
    constructor(private readonly gitlabApiService: GitlabApiService) {}

    /**
     * This function updates the Merge request description and if the build is accepted then it will retry the failed external service job
     * @param payload 
     */
    public async buildUpdates(payload: any): Promise<any> {
        const mergeRequestId = await this.gitlabApiService.getMergeRequestDetails(payload.commit);
        await this.gitlabApiService.updateMergeRequestDetails(payload, mergeRequestId);

        if(payload.status == BuildStatus.ACCEPTED) {
            const pipelineId = await this.gitlabApiService.getPipelineDetails(mergeRequestId);
            const jobId = await this.gitlabApiService.getJobDetails(pipelineId);
            const variableData = (payload.status === BuildStatus.ACCEPTED) ? {
                "job_variables_attributes": [
                  {
                    "key": "WEBHOOK_STATUS",
                    "value": payload.status
                  }
                ]
            } : {};
            await this.gitlabApiService.playManualJob(jobId,variableData);
        }

        return 'Successfuly updated Chromatic Build Details';
    }
    
    /**
     * This function creates an gitlab Issue when a manual PR is created in Chromatic
     * @param payload 
     */
    public async reviewUpdates(payload: any): Promise<any> {
        const issueId = await this.gitlabApiService.getIssue(`${payload.number} - ${payload.title}`, "title");

        if(issueId) {
            return `Already an Issue is created with the title ${payload.number} - ${payload.title}`;
        }

        await this.gitlabApiService.createIssue(payload);
        return 'Successfuly created an Issue in gitlab';
    }
    
    /**
     * Function to update issue and close/reopen the issue.
     * @param payload 
     */
    public async reviewDecisions(payload: any): Promise<any> {
        const issueId = await this.gitlabApiService.getIssue(`${payload.review.number} - ${payload.review.title}`, "title");
        await this.gitlabApiService.updateIssue(payload, issueId);
        return 'Successfuly updated an Issue in gitlab';
    }
}
