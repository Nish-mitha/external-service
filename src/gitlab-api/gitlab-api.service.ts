import { Injectable } from '@nestjs/common';
import { ApiService } from 'src/api/api.service';
import { Badges, BuildStatus, VisualTestJobName } from 'src/util';

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
    public async updateMergeRequestDetails(payload: any, mergeRequestId: number): Promise<any> {
        var descriptionTitle = payload?.changeCount ? `${payload.changeCount} changes found in the Visual Tests.` : "No changes found in the Visual Tests.";
        
        var mergeRequestDesc = `### :mag: ${descriptionTitle}
![${payload.status}](${Badges[payload.status]}) <br><br> **Storybook URL:** ${payload.storybookUrl} <br><br> **Chromatic Build URL:** ${payload.webUrl} <br><br> **Result:** ${payload.result}`;

        if(payload.status === BuildStatus.PREPARED || payload.status === BuildStatus.IN_PROGRESS || payload.status === BuildStatus.PUBLISHED) {
            mergeRequestDesc = `### ${payload.status}
![${payload.status}](${Badges[payload.status]}) <br><br> **Storybook URL:** ${payload.storybookUrl} <br><br> **Chromatic Build URL:** ${payload.webUrl}`;
        }

        const queryParams= {
            description: mergeRequestDesc
        };

        return await this.apiService.putData(`${process.env.GITLAB_URL}/projects/${process.env.PROJECT_ID}/merge_requests/${mergeRequestId}`, queryParams);

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
     * Function to play the manual Jobs
     * @param jobId 
     */
    public async playManualJob(jobId: number, data: any): Promise<any> {
        return await this.apiService.postData(`${process.env.GITLAB_URL}/projects/${process.env.PROJECT_ID}/jobs/${jobId}/play`, data);
    }

    /**
     * Function to create an issue in gitlab
     * @param payload 
     */
    public async createIssue(payload: any): Promise<any> {
        const queryParams= {
            title: `${payload.number} - ${payload.title}`,
            labels: "Visual Test Review",
            issue_type: "issue",
            description: `### ${payload.title}
<br>**Status:** ${payload.status} <br><br> **Source Branch:** ${payload.headRefName} **Target Branch:** ${payload.baseRefName} <br><br> **URL:** ${payload.webUrl}`
            
        };
        return await this.apiService.postData(`${process.env.GITLAB_URL}/projects/${process.env.PROJECT_ID}/issues`, queryParams);
    }

    /**
     * Function to get Issue Id based on the title
     * @param state 
     * @param searchParam 
     * @param searchIn 
     * @returns issue Id
     */
    public async getIssue(searchParam: string, searchIn :string): Promise<any> {
        const queryParams = {
            search: searchParam,
            in: searchIn
        };
        const response = await this.apiService.fetchData(`${process.env.GITLAB_URL}/projects/${process.env.PROJECT_ID}/issues`, queryParams);

        if(Object.keys(response).length == 0) {
            return false;
        }

        if(Object.keys(response).length > 1) {
            return  `More than 2 issue with same title` ;
        }
        return response[0]['iid'];
    }

    /**
     * Function to update the gitlab issue
     * @param payload 
     * @param issueId 
     */
    public async updateIssue(payload: any, issueId: number): Promise<any> {
        const issueStatus = (payload.review.status == "OPEN" && payload.status != "APPROVED" ) ? "reopen" : "close";
        const queryParams = {
            state_event: issueStatus,
            description: `### ${payload.review.title}
<br>**Status:** ${payload.review.status} <br><br> **Reviewer Decision:** ${payload.status} <br><br> **Source Branch:** ${payload.review.headRefName} **Target Branch:** ${payload.review.baseRefName} <br><br> **URL:** ${payload.review.webUrl}`
        };
        return await this.apiService.putData(`${process.env.GITLAB_URL}/projects/${process.env.PROJECT_ID}/issues/${issueId}`, queryParams);
    }
}
