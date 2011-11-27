var knox = require('knox');

var client = knox.createClient({
  key: process.env.AWS_KEY,
  secret: process.env.AWS_SECRET,
  bucket: 'cloudy-test'
});

module.exports = client;
