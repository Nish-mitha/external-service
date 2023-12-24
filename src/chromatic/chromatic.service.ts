import { Injectable } from '@nestjs/common';
import { ApiService } from 'src/api/api.service';
import { BuildStatus } from 'src/util';

@Injectable()
export class ChromaticService {
    constructor(private readonly apiService: ApiService) {}

    public async buildUpdates(payload: any): Promise<void> {
        const dataToUpdate= {
            description: `# Chromatic Build Report  
![${payload.status}](https://img.shields.io/badge/Status-Accepted-brightgreen?style=flat-square&logo=success) <br> **Storybook URL:** ${payload.storybookUrl} <br> **Chromatic Build URL:** ${payload.webUrl} <br> **Result:** ${payload.result}`
            
        };
        const mergeRequestId = await this.getMergeRequestDetails(payload.commit);
        const url = `${process.env.GITLAB_URL}/projects/${process.env.PROJECT_ID}/merge_requests/${mergeRequestId}`;
        await this.apiService.putData(url, dataToUpdate);

        if(payload.status == BuildStatus.ACCEPTED) {
            const pipelineId = await this.getPipelineDetails(mergeRequestId);
            const jobId = await this.getJobDetails(pipelineId);
            await this.apiService.postData(`${process.env.GITLAB_URL}/projects/${process.env.PROJECT_ID}/jobs/${jobId}/retry`, {});
        }
    }
    
    public async reviewUpdates(payload: any): Promise<void> {
        /**
         * Need to add
         */
    }
    
    public async reviewDecisions(payload: any): Promise<void> {
        /**
         * Need to add
         */
    }
    
    private async getMergeRequestDetails(commitId: string): Promise<number> {
        const url = `${process.env.GITLAB_URL}/projects/${process.env.PROJECT_ID}/repository/commits/${commitId}/merge_requests`;
        const response = await this.apiService.fetchData(url);
        return response['iid'];
    }

    private async getPipelineDetails(mergeRequestId: number): Promise<number> {
        const url = `${process.env.GITLAB_URL}/projects/${process.env.PROJECT_ID}/merge_requests/${mergeRequestId}/pipelines?per_page=1&order_by=id&sort=desc`;
        const response = await this.apiService.fetchData(url);
        return response['id'];
    }

    private async getJobDetails(pipelineId: number): Promise<number> {
        const url = `${process.env.GITLAB_URL}/projects/${process.env.PROJECT_ID}/pipelines/${pipelineId}/jobs`;
        const response = await this.apiService.fetchData(url);
        return response['id'];
    }
}
