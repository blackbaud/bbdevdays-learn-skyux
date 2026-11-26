import { AnimalProfile } from './animal-profile';

export type AnimalProfileSerialized = Omit<
  AnimalProfile,
  'birthdate' | 'createdAt' | 'updatedAt'
> & {
  birthdate?: string;
  createdAt: string;
  updatedAt: string;
};
