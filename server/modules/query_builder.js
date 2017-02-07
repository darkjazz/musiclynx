var queries = require('./queries').queries;

var appendPrefixes = function(template) {
  var prefix_template = queries.prefixes;
  var prefixes = prefix_template.split('\n');
  var selected = "";
  for (var i=0; i < prefixes.length; i++) {
    var prefix = prefixes[i];
    var sub = prefix.substring(prefix.indexOf(" "), prefix.indexOf(":") + 1);
    if (template.indexOf(sub) > -1) {
      selected += prefix + "\n";
    }
  }
  return selected + template;
}

var replaceParameters = function(query, parameters) {
  parameters.forEach(function(param) {
    var key = Object.keys(param)[0];
    query = query.replace(new RegExp("%" + key, 'g'), param[key]);
  });
  return query;
}

var buildQuery = function(name, parameters) {
  var template = queries[name];
  var query = appendPrefixes(template);
  return replaceParameters(query, parameters);
}

module.exports.buildQuery = buildQuery;
