export interface ReviewInterface {
    user: string,
    entityId: string,
    entityType: 'Product' | 'Store',
    rating: number,
    comment: string
}
