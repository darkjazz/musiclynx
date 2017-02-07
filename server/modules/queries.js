const PREFIXES = `
PREFIX p: <http://www.wikidata.org/prop/>
PREFIX ps: <http://www.wikidata.org/prop/statement/>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX dbpo: <http://dbpedia.org/ontology/>
PREFIX dbpp: <http://dbpedia.org/property/>
PREFIX dbpr: <http://dbpedia.org/resource/>
PREFIX mo: <http://purl.org/ontology/mo/>
PREFIX mood: <http://sovarr.c4dm.eecs.qmul.ac.uk/moodplay/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX mo: <http://purl.org/ontology/mo/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
`;

const IMAGE_BY_MBID = `
SELECT ?entity_id ?image_uri WHERE {
  ?statement ps:P434 "%MBID" .
  ?entity_id p:P434 ?statement ;
    p:P18 ?image_statement .
  ?image_statement ps:P18 ?image_uri .
}
`;

const ARTIST_ABSTRACT = `
SELECT DISTINCT ?about ?abs ?dbpedia_uri WHERE {
  {
    SELECT ?about ?abs ?dbpedia_uri WHERE {
      <%URI> dbpo:wikiPageRedirects ?dbpedia_uri .
      ?dbpedia_uri foaf:isPrimaryTopicOf ?about ;
        dbpo:abstract ?abs .
    }
  }
  UNION
  {
    SELECT ?about ?abs ?dbpedia_uri WHERE {
      <%URI> foaf:isPrimaryTopicOf ?about ;
        dbpo:abstract ?abs .
      BIND(<%URI> as ?dbpedia_uri)
    }
  }
  FILTER( LANG(?abs)="%LANG" || LANG(?abs)="") .
}
`

const ARTIST_CATEGORIES = `
SELECT DISTINCT ?yago WHERE {
 dbpr:%URI a ?yago .
FILTER(REGEX(STR(?yago),"http://dbpedia.org/class/yago/Wikicat"))
}
`

const MBID_BY_ENTITYID = `
SELECT ?mbid WHERE {
  ?statement ps:P434 ?mbid .
  wd:%ENTITYID p:P434 ?statement .
}
`

module.exports.queries = {
  "prefixes": PREFIXES,
  "image_by_mbid": IMAGE_BY_MBID,
  "artist_abstract": ARTIST_ABSTRACT,
  "mbid_by_entityid": MBID_BY_ENTITYID,
  "artist_categories": ARTIST_CATEGORIES
}
