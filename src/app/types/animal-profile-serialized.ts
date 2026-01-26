export interface AnimalProfileSerialized {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  bio: string;
  gender: string;
  breed: string;
  birthdate?: string;
  needsAttention?: boolean;
  images: {
    filename: string;
    url: string;
  }[];
}
