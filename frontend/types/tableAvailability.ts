export interface TableAvailability {
    tableId: number;
    tableNo: string;
    capacity: number;
    position: string;
    imageUrl: string | null;
    isAvailable: boolean;
}