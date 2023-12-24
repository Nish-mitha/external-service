export type Obj = {
    [key: string]: string
}

export enum BuildStatus {
    PUBLISHED = 'PUBLISHED',
    PREPARED = 'PREPARED',
    IN_PROGRESS = 'IN_PROGRESS',
    PENDING = 'PENDING',
    PASSED = 'PASSED',
    ACCEPTED = 'ACCEPTED',
    DENIED = 'DENIED',
    BROKEN = 'BROKEN',
    CANCELLED = 'CANCELLED',
    FAILED = 'FAILED'
}

export const VisualTestJobName = "UI TESTS";

export enum Badges {
    ACCEPTED = "https://img.shields.io/badge/Status-Accepted-brightgreen",
    DENIED = "https://img.shields.io/badge/Status-Denied-red",
    PENDING = "https://img.shields.io/badge/Status-Pending-yellow"
}