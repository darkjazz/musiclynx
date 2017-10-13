import { Artist } from './artist';

export class Category {
  uri: string;
  label: string;
  parent: Artist;
  artists: Artist[];
}
