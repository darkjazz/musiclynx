var validate = function(artist) {
  return (artist._id.length === 36 && artist["rdfs:label"] )
}

module.exports.validate = validate;
