const Memcached = require("memcached");

let memcached = new Memcached(process.env.MEMCACHE_URL);

exports.memcachedMiddleware = (duration) => {
  return (req, res, next) => {
    let key = "__express__" + req.originalUrl || req.url;
    
    memcached.get(key, function (err, data) {
      
      if (data) {
        res.status(200).json(JSON.parse(data));
        return;
      } else {
        res.sendResponse = res.send;
        res.send = (body) => {
          memcached.set(key, body, duration * 60, function (err) {
            //
          });
          res.sendResponse(body);
        };
        next();
      }
    });
  };
};
