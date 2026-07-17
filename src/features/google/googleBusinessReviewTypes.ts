export type GoogleBusinessReview = {
  id: string;
  authorName: string;
  authorUrl?: string;
  authorPhotoDataUrl?: string;
  rating: number;
  text?: string;
  languageCode?: string;
  publishTime?: string;
  relativePublishTime?: string;
  reviewUrl?: string;
  reportUrl?: string;
  /** True only for an explicitly labelled local translation of a verified review. */
  isTranslated?: boolean;
};

export type GoogleBusinessReviewFeed = {
  placeId: string;
  placeName: string;
  rating: number;
  userRatingCount: number;
  reviews: GoogleBusinessReview[];
};
