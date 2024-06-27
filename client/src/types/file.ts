export interface IFileData {
  branch: string;
  createdAt: string;
  examType: string;
  file: {
    url: string;
  };
  institutionName: string;
  rating: Array<{
    ratingType: string;
    totalRating: number;
    averageRating: number;
    _id: string;
  }>;
  semester: string;
  subjectCode: string;
  subjectName: string;
  tags: Array<string>;
  updatedAt: string;
  uploadedBy?: null | string; // Assuming uploadedBy can be null or a string
  year: string;
  __v: number;
  _id: string;
}

export type TRatingType = 'HELPFUL' | 'STANDARD' | 'RELEVANCE';

export interface IRating {
  postId: string;
  ratingArray: Array<{ type: TRatingType; value: number }>;
}
export interface IEditTags {
  postId: string;
  tagsToAdd: Array<string>;
  tagsToRemove: Array<string>;
}
