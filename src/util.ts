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