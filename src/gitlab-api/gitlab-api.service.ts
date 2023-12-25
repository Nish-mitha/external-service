import { Injectable } from '@nestjs/common';
import { ApiService } from 'src/api/api.service';
import { Badges, VisualTestJobName } from 'src/util';

@Injectable()
export class GitlabApiService {

    constructor(private readonly apiService: ApiService) {}

    /**
     * Function to get Merge Request ID based on the commit ID.
     * @param commitId 
     * @returns mergeRequestID
     */
    public async getMergeRequestDetails(commitId: string): Promise<number> {
        const url = `${process.env.GITLAB_URL}/projects/${process.env.PROJECT_ID}/repository/commits/${commitId}/merge_requests`;
        const response = await this.apiService.fetchData(url);
        return response[0]['iid'];
    }

    /**
     * Function to update Merge Request Details.
     * @param payload 
     * @param mergeRequestId 
     */
    public async updateMergeRequestDetails(payload: any, mergeRequestId: number): Promise<void> {
        const dataToUpdate= {
            description: `### :mag: ${payload.changeCount} changes found in the Visual Tests.
![${payload.status}](${Badges[payload.status]}) <br><br> **Storybook URL:** ${payload.storybookUrl} <br><br> **Chromatic Build URL:** ${payload.webUrl} <br><br> **Result:** ${payload.result}`
        };

        await this.apiService.putData(`${process.env.GITLAB_URL}/projects/${process.env.PROJECT_ID}/merge_requests/${mergeRequestId}`, dataToUpdate);

    }

    /**
     * Function to get latest pipeline id based on the merge request ID
     * @param mergeRequestId 
     * @returns PipelineId
     */
    public async getPipelineDetails(mergeRequestId: number): Promise<number> {
        const url = `${process.env.GITLAB_URL}/projects/${process.env.PROJECT_ID}/merge_requests/${mergeRequestId}/pipelines?per_page=1&order_by=id&sort=desc`;
        const response = await this.apiService.fetchData(url);
        return response[0]['id'];
    }

    /**
     * Function to get job id based on the pipeline ID for Job name "UI TESTS"
     * @param pipelineId 
     * @returns Job ID
     */
    public async getJobDetails(pipelineId: number): Promise<number> {
        const url = `${process.env.GITLAB_URL}/projects/${process.env.PROJECT_ID}/pipelines/${pipelineId}/jobs`;
        const response = await this.apiService.fetchData(url);
        const VisualTestJobRes = response.find(job => job.name === VisualTestJobName)
        return VisualTestJobRes['id'];
    }

    /**
     * Function to retry failed Jobs
     * @param jobId 
     */
    public async retryFailedJob(jobId: number): Promise<void> {
        await this.apiService.postData(`${process.env.GITLAB_URL}/projects/${process.env.PROJECT_ID}/jobs/${jobId}/retry`, {});
    }

    /**
     * Function to create an issue in gitlab
     * @param payload 
     */
    public async createIssue(payload: any): Promise<void> {
        const dataToUpdate= {
            title: `${payload.number} - ${payload.title}`,
            labels: "Visual Test Review",
            issue_type: "task",
            description: `### ${payload.title}
<br>**Status:** ${payload.status} <br><br> **Source Branch:** ${payload.headRefName} **Target Branch:** ${payload.baseRefName} <br><br> **URL:** ${payload.webUrl}`
            
        };
        await this.apiService.postData(`${process.env.GITLAB_URL}/projects/${process.env.PROJECT_ID}/issues`, dataToUpdate);
    }
}
