import { Artist } from './artist';

export class Category {
  dbpedia_uri: string;
  label: string;
  parent: Artist;
  artists: Artist[];
}
