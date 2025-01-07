const config = {
  db:"mongodb+srv://carfinder:supersecret@car-finder.e9lmk.mongodb.net/?retryWrites=true&w=majority&appName=Car-finder",
  secret: "supersecret",
  expiresPassword: 86400,
  saltRounds: 10,
};

module.exports = config;
