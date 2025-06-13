export class ReviewItemDto {
  reviewer: string;
  createdAt: string; // 2024-07-16 19:30
  content: string;
  rating: number; // 1~5
}

export interface ResponsePartyDetailDto {
  partyId: number;
  partyImage: string;
  title: string;
  content: string;
  location: string;
  partyDate: string;
  startDate: string;
  endDate: string;
  partyState: string;
  personnel: number;
  currentPersonnel: number;
  tags: string[];
  host: string;
  reviews: {
    reviewer: string;
    createdAt: string;
    content: string;
    rating: number;
  }[];
  averageRating: number;
  reviewCount: number;
}
