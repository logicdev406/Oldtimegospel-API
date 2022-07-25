const response = require('./response');

module.exports = function paginatedResults(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < (await model.count())) {
      results.next = {
        page: page + 1,
        limit: limit
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      };
    }

    if (endIndex > (await model.count())) {
      return res
        .status(500)
        .send(response(' No data on this page ', {}, false));
    }

    try {
      results.results = await model.findAll({
        limit: limit,
        offset: startIndex
      });

      res.paginatedResults = results;
      next();
    } catch (e) {
      console.log(e.message);
      res.status(500).send(response(e.message, {}, false));
    }
  };
};
