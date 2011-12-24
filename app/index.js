var connect   = require('connect')
  , quip      = require('quip')
  , dice      = require('roll/lib/index.js')
  , hostname  = 'roller.local'
;

connect(
  connect.favicon()
, quip()
  // TODO: Pull middleware out into their own modules

  // pull dice (e.g. 3d6+2) and response type (e.g. json) "parameters"
  // out of hostname and store in req object
, function(req, res, next) {
      var regexp    = new RegExp('^(.*?)(\.(json)\.)?' + hostname + '$')
        , reqHostname  = req.headers.host.split(':')[0]
        , hostnameMatch
      ;

      if ( hostnameMatch = regexp.exec(reqHostname) ) {
        req.dieExpr = hostnameMatch[1].split('.')[0];

        req.isJson = hostnameMatch[2];
      }

      next();
  }

  // assign req.isJson based on hostname parameter or Content-Type header
, function(req, res, next) {
    var reqContentType = req.headers['content-type'] || '';

    if  ( req.isJson || -1 !== reqContentType.indexOf('json') ) {
      req.isJson = true;
    }

    next();
  }

  // roll requested dice (if any) and store the result in the res object
, function(req, res, next) {
    if ( req.dieExpr ) {
      try {
        res.dice = dice.roll(req.dieExpr);

        next();
      }
      catch (err) {
        // 'roll' doesn't have very good error handling :(
        if (err instanceof TypeError) {
          console.error(err);

          res.badRequest();
        } else {
          throw err;
        }
      }
    } else {
      // no die expr. given--help?
      res.ok( "usage: ...\n" );
    }
  }
, function(req, res, next) {
    if ( res.dice.result ) {
      if ( req.isJson ) {
        res.json( res.dice );
      } else {
        res.plain( '' + res.dice.result );
      }
    } else {
      res.error('Something went wrong.')
    }
  }
).listen(2020);

console.log('Ready.');
