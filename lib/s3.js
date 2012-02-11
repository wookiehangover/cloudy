var knox = require('knox');

module.exports = knox.createClient({
  key: process.env.AWS_KEY,
  secret: process.env.AWS_SECRET,
  bucket: 'cloudy-test'
});

