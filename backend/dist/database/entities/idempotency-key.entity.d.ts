export declare class IdempotencyKeyEntity {
    key: string;
    schoolId: string;
    parentId?: string;
    responseCode?: number;
    responseBody?: Record<string, unknown>;
    expiresAt?: Date;
    createdAt: Date;
}
