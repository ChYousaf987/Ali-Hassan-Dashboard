export interface Blog {
    id: string;
    title: string;
    image: string;
    content: string;
    category: string;
    createdAt: any; // firebase.firestore.Timestamp or Date
}

export interface Category {
    id: string;
    value: string;
    label: string;
}
