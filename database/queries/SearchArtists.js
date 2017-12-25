const Artist = require('../models/artist');

/**
 * Searches through the Artist collection
 * @param {object} criteria An object with a name, age, and yearsActive
 * @param {string} sortProperty The property to sort the results by
 * sortProperty can be age or name or albums released
 * @param {integer} offset How many records to skip in the result set
 * @param {integer} limit How many records to return in the result set
 * @return {promise} A promise that resolves with the artists, count, offset, and limit
 * like this: { all : [artists], count: count, offset: offset, limit: limit }
 */
module.exports = (criteria, sortProperty, offset = 0, limit = 20) => {
  // Write a query that will follow sort, offset, limit options only - Part 1
  // do not worry about 'criteria' yet - Part 2

  // console.log(criteria);
  // by default criteria has single 'name' property
  // then we move the sliders for Age and Years Active, we see additional props in criteria
  // example, criteria : { name: "", age: {max:32, min: 22}, yearsActive: {max: 11, min: 5} }

  // ES5 approach
  // const sortOrder = {};
  // sortOrder[sortProperty] = 1
  // Artist.find({})
  //   .sort(sortOrder)

  // ES6 approach

  const query = Artist.find(buildQuery(criteria))
    .sort({ [sortProperty]: 1 }) // ES6 interpolated keys
    .skip(offset)
    .limit(limit);

  // Artist.count() is a promise
  // Artist.find(buildQuery(criteria)).count() - purpose of this to find the number of
  // records that match this criteria running query
  // So essentially we have to execute the criteria query twice but without the sort, skip and limit operations
  return Promise.all([query, Artist.find(buildQuery(criteria)).count()]).then(
    results => {
      return {
        all: results[0], // from 'query'
        count: results[1],
        offset: offset,
        limit: limit
      };
    }
  );
};

const buildQuery = criteria => {
  // console.log(criteria);
  // by default criteria has single 'name' property
  // then we move the sliders for Age and Years Active, we see additional props in criteria
  // example, criteria : { name: "", age: {max:32, min: 22}, yearsActive: {max: 11, min: 5} }

  const query = {};

  if (criteria.name) {
    query.$text = { $search: criteria.name };
  }

  if (criteria.age) {
    query.age = {
      $gte: criteria.age.min, // get artists that are greater than or equal to criteria.age.min
      $lte: criteria.age.max // get artists that are less than or equal to criteria.age.max
    };
  }

  if (criteria.yearsActive) {
    query.yearsActive = {
      $gte: criteria.yearsActive.min,
      $lte: criteria.yearsActive.max
    };
  }

  return query;
};
