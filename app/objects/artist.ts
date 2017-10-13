import { Category } from './category';

export class Artist {
  id: string;
  name: string;
  disambiguation: string;
  score: Number;
  requests: Number;
  image: string;
  original_image: string;
  origin: string;
  abstract: string;
  dbpedia_uri: string;
  wikipedia_uri: string;
  entity_id: string;
  categories: Category[];
  associated_artists: Category;
}
