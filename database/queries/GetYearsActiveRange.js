const Artist = require('../models/artist');

/**
 * Finds the lowest and highest yearsActive of artists in the Artist collection
 * @return {promise} A promise that resolves with an object
 * containing the min and max yearsActive, like { min: 0, max: 14 }.
 */
module.exports = () => {
  const minQuery = Artist.find({})
    .sort({ yearsActive: 1 }) // '1' for ascending order
    .limit(1) // only get back the first artist model from the sorted list
    .then(artists => artists[0].yearsActive);
  // 'artists' instead of single artist,because returned data is an array because
  // returned data is an arrayof model with one single element in it as the limit was set to '1'

  const maxQuery = Artist.find({})
    .sort({ yearsActive: -1 }) // '-1' for ascending order
    .limit(1)
    .then(artists => artists[0].yearsActive);

  return Promise.all([minQuery, maxQuery]).then(result => {
    // result array contains minQuery and maxQuery results
    return { min: result[0], max: result[1] };
  });
};
