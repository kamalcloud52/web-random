export interface User {
  id: string;
  name: string;
  photo?: string;
  location?: string;
  role: 'user' | 'worker';
}

export interface Worker {
  id: string;
  category: string;
  categories: string[];
  description: string;
  verified: boolean;
  rating: number;
  activeStatus: string;
  workArea: string;
  whatsapp: string;
}

export interface Portfolio {
  id: string;
  workerId: string;
  image: string;
  caption: string;
  createdAt: any;
}

export interface Review {
  id: string;
  workerId: string;
  username: string;
  rating: number;
  comment: string;
}

export type Category = {
  id: string;
  name: string;
  icon: string;
};
