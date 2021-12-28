const notFound = (req, res) => res.status(404).send('in not-found middleware, Route does not exist');

module.exports = notFound
