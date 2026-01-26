import { AnimalProfile } from './animal-profile';

export interface AnimalProfileRow extends AnimalProfile {
  selected: boolean;
  menu: boolean;
  image: boolean;
}
