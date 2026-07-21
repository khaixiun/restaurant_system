export interface Table {
    id: number;
    tableNo: string;
    capacity: number;
    position: string;
    isReservable: boolean;
    imageUrl: string | null;
    createdAt: string;
}