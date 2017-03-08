const PREFIXES = {
  "p": "http://www.wikidata.org/prop/",
  "ps": "http://www.wikidata.org/prop/statement/",
  "wd": "http://www.wikidata.org/entity/",
  "dbpo": "http://dbpedia.org/ontology/",
  "dbpp": "http://dbpedia.org/property/",
  "dbpr": "http://dbpedia.org/resource/",
  "mo": "http://purl.org/ontology/mo/",
  "mood": "http://sovarr.c4dm.eecs.qmul.ac.uk/moodplay/",
  "foaf": "http://xmlns.com/foaf/0.1/",
  "mo": "http://purl.org/ontology/mo/",
  "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
  "owl": "http://www.w3.org/2002/07/owl#",
  "dbp-yago": "http://dbpedia.org/class/yago/",
  "dc": "http://purl.org/dc/elements/1.1/",
  "co": "http://purl.org/ontology/co/core#",
  "dc": "http://purl.org/dc/elements/1.1/"
};

const SPARQL_TEMPLATE = "PREFIX %P: <%U>\n";
const N3_TEMPLATE = "prefix %P: <%U> .\n";

module.exports.prefixes = {
  "prefixes": PREFIXES,
  "sparql_template": SPARQL_TEMPLATE,
  "n3_template": N3_TEMPLATE
}
