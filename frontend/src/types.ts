export interface Transaction {
    id: number;
    customer: string;
    amount: number;
    date: string;
    status: 'pending' | 'accepted' | 'rejected';
}
