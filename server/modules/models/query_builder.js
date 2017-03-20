var queries = require('./queries').queries;
var prefixes = require('./prefixes').prefixes;

var appendPrefixes = function(template) {
  var pfx_template = prefixes.sparql_template;
  var pfxs = prefixes.prefixes;
  var selected = "";
  for (var pfx in pfxs) {
    if (template.indexOf(" " + pfx + ":") > -1) {
      selected += pfx_template.replace("%P", pfx).replace("%U", pfxs[pfx]);
    }
  }
  return selected + template;
}

var replaceParameters = function(query, parameters) {
  Object.keys(parameters).forEach(function(key){
    query = query.replace(new RegExp("%" + key, 'g'), parameters[key])
  })
  return query;
}

var buildQuery = function(name, parameters) {
  var template = queries[name];
  var query = appendPrefixes(template);
  return replaceParameters(query, parameters);
}

module.exports.buildQuery = buildQuery;
