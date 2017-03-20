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
`;

const ASSOCIATED_ARTISTS = `
SELECT DISTINCT ?dbpedia_uri ?name WHERE {
 { ?dbpedia_uri dbpo:associatedMusicalArtist <%URI> }
 UNION
 { ?dbpedia_uri dbpo:associatedBand <%URI> }
 ?dbpedia_uri rdfs:label ?name .
 FILTER( LANG(?name)="%LANG" || LANG(?name)="") .
}
`;

const ARTIST_CATEGORIES = `
SELECT DISTINCT ?yago WHERE {
 <%URI> a ?yago .
FILTER(REGEX(STR(?yago),"http://dbpedia.org/class/yago/Wikicat"))
FILTER(?yago != <http://dbpedia.org/class/yago/WikicatLivingPeople>)
FILTER(?yago != <http://dbpedia.org/class/yago/WikicatWomen>)
}
`;

const WIKICAT_LINKS = `
SELECT DISTINCT ?uri ?name WHERE {
 ?uri a <%YAGO_URI> ;
   foaf:name ?name .
 { ?uri a dbpo:Band } UNION { ?uri a dbpo:MusicArtist } UNION { ?uri a dbp-yago:Composer109947232 } UNION { ?uri a yago:Musician110340312 }
 FILTER(?uri != <%ARTIST_URI>) .
} LIMIT %LIMIT
`;

const MBID_BY_ENTITYID = `
SELECT ?mbid WHERE {
  ?statement ps:P434 ?mbid .
  wd:%ENTITYID p:P434 ?statement .
}
`;

const MOODPLAY_ARTISTS = `
SELECT ?artist ?mbid
WHERE
{
  SELECT ?artist ?mbid (AVG(?valence) as ?avg_valence) (AVG(?arousal) as ?avg_arousal) ((ABS(AVG(?target_valence)-AVG(?valence)) + ABS(AVG(?target_arousal)-AVG(?arousal))) / 2 as ?diff)
  WHERE {
    {
      SELECT ?target_valence ?target_arousal
      WHERE {
      	?target_coords mood:valence ?target_valence ;
          mood:arousal ?target_arousal ;
          mood:configuration mood:actfold4 .
        ?target_lfmid mood:coordinates ?target_coords ;
          mood:artist_name ?target_artist .
        FILTER(LCASE(?target_artist) = LCASE("%ARTIST"))
      }
    }
    ?coords mood:valence ?valence ;
      mood:arousal ?arousal ;
      mood:configuration mood:actfold4 .
    ?lfmid mood:coordinates ?coords ;
      foaf:maker ?maker ;
      mood:artist_name ?artist .
    ?maker mo:musicbrainz_guid ?mbid .
    FILTER(LCASE(?artist) != LCASE("%ARTIST"))
  } GROUP BY ?artist ?mbid ORDER BY ?diff
} LIMIT %LIMIT
`;

CONSTRUCT_ARTIST = `
CONSTRUCT {
   <%URI> dbpo:abstract ?abstract ;
      dbpo:wikiPageRedirects ?dbpedia_uri ;
      dbpo:about ?about ;
      foaf:name ?name ;
      a ?wikicat .
}
WHERE {
  {
    SELECT ?about ?abstract ?dbpedia_uri ?name ?wikicat WHERE {
      <%URI> dbpo:wikiPageRedirects ?dbpedia_uri .
      ?dbpedia_uri a ?wikicat ;
        foaf:isPrimaryTopicOf ?about ;
        foaf:name ?name ;
        dbpo:abstract ?abstract .
    }
  }
  UNION
  {
    SELECT ?about ?abstract ?dbpedia_uri ?name ?wikicat WHERE {
      <%URI> a ?wikicat ;
        foaf:isPrimaryTopicOf ?about ;
        foaf:name ?name ;
        dbpo:abstract ?abstract .
      BIND(<%URI> as ?dbpedia_uri)
    }
  }

  FILTER(REGEX(STR(?wikicat),"http://dbpedia.org/class/yago/Wikicat"))
  FILTER(?wikicat != <http://dbpedia.org/class/yago/WikicatLivingPeople>)
  FILTER(?wikicat != <http://dbpedia.org/class/yago/WikicatWomen>)
  FILTER( LANG(?abstract)="en" || LANG(?abstract)="")
  FILTER( LANG(?name)="%LANG" || LANG(?name)="" )
}
`

module.exports.queries = {
  "image_by_mbid": IMAGE_BY_MBID,
  "artist_abstract": ARTIST_ABSTRACT,
  "associated_artists": ASSOCIATED_ARTISTS,
  "mbid_by_entityid": MBID_BY_ENTITYID,
  "artist_categories": ARTIST_CATEGORIES,
  "wikicat_links": WIKICAT_LINKS,
  "moodplay_artists": MOODPLAY_ARTISTS,
  "construct_artist": CONSTRUCT_ARTIST
}
