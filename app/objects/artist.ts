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
  types: string[];
  associated_artists: Artist[];
}

export const ArtistMap = {
  name: "rdfs:label",
  disambiguation: "rdfs:comment",
  original_image: "mo:image",
  abstract: "dbpo:abstract",
  dbpedia_uri: "dbpr:resource",
  wikipedia_uri: "foaf:isPrimaryTopicOf",
  entity_id: "wd:entity",
  types: "rdf:type",
  associated_artists: "dbpo:associatedMusicalArtist",
  requests: "co:count"
}
