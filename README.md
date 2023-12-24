# Chromatic Custom Webhooks and GitLab Integration

## Overview

This repository provides an integration between Chromatic's custom webhooks and GitLab, specifically tailored for use with Chromatic's free plan.

## Getting Started

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/Nish-mitha/external-service.git
    cd your-repo
    ```

2. **Update Configuration:**

    Update the `common.env` files with the necessary configuration details.
    PROJECT_ACCESS_TOKEN=<Gitlab project access token>
    GITLAB_URL=<Self hosted Gitlab url>
    PROJECT_ID=<Your angular project ID>

3. **Run Docker Compose:**

    Execute the Docker Compose command to deploy the integration:

    ```bash
    docker-compose up -d
    ```

## Configuration

Make sure to update the `common.env` files with the required configuration variables such as project tokens, and any other settings necessary for your Chromatic and GitLab integration.

## Usage

This integration allows for seamless communication between Chromatic and GitLab, facilitating automated processes and workflows associated with visual testing.

Feel free to customize the integration based on your specific requirements and workflows.

---

*Note: Ensure that Docker and Docker Compose are installed on your machine before running the integration.*
