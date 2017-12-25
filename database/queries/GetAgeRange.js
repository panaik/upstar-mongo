const Artist = require('../models/artist');

/**
 * Finds the lowest and highest age of artists in the Artist collection
 * @return {promise} A promise that resolves with an object
 * containing the min and max ages, like { min: 16, max: 45 }.
 */
module.exports = () => {
  const minQuery = Artist.find({})
    .sort({ age: 1 }) // '1' for ascending order
    .limit(1) // only get back the first artist model from the sorted list
    .then(artists => artists[0].age);
  // 'artists' instead of single artist,because returned data is an array because
  // returned data is an arrayof model with one single element in it as the limit was set to '1'

  const maxQuery = Artist.find({})
    .sort({ age: -1 }) // '-1' for ascending order
    .limit(1)
    .then(artists => artists[0].age);

  return Promise.all([minQuery, maxQuery]).then(result => {
    // result array contains minQuery and maxQuery results
    return { min: result[0], max: result[1] };
  });
};

// when this promise gets used somewhere in the app, it would be used in this manner
// GetAgeRange()
//   .then((argument)=>{
//     console.log(argument); // { min: 14, max: 35 }
//   })

// This query using Aggregations
// return Artist.aggregate()
//   .group({
//     _id: null,
//     min: { $min: '$age' },
//     max: { $max: '$age' }
//   })
//   .project({ _id: 0, min: 1, max: 1 })
//   .then(result => result[0]);
