export interface SuperheroDetailsResponse {
    id: number;
    nickname: string;
    real_name: string;
    origin_description: string;
    superpowers: string[];
    catch_phrase: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface SuperheroListItemResponse {
    id: number;
    nickname: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}