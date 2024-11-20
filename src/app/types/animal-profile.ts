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
