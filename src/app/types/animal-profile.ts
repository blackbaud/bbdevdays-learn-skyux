export interface AnimalProfile {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  bio: string;
  gender: string;
  breed: string;
  birthdate?: Date;
  needsAttention?: boolean;
  images: {
    filename: string;
    url: string;
  }[];
}
