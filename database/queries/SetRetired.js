const Artist = require('../models/artist');

/**
 * Sets a group of Artists as retired
 * @param {array} _ids - An array of the _id's of of artists to update
 * @return {promise} A promise that resolves after the update
 */
module.exports = _ids => {
  // Mongoose update function updates multiple records only if we pass a prop multi: true to the query
  // by default multi is false, which means multiple docs will not be updated by default
  return Artist.update(
    { _id: { $in: _ids } },
    { retired: true },
    { multi: true }
  );
};
