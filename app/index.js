var connect   = require('connect')
  , quip      = require('quip')
  , dice      = require('roll/lib/index.js')
  , hostname  = 'roller.local'

    // get the expression for the dice to roll from the subdomain,
    // e.g. 2d6+1.roller.local
  , getDieExpr  = function(req, host) {
      var regexp    = new RegExp('^(.*?)' + host + '$')
        , hostname  = req.headers.host.split(':')[0]
        , subdomains
      ;

      if ( subdomains = regexp.exec(hostname) ) {
        return subdomains[0].split('.')[0];
      }

      return;
    }
;

connect(
  connect.favicon()
, quip()
, function(req, res, next) {
    var dieExpr, rolled;

    // respond with text/plain by default
    res = res.plain();
    
    if (dieExpr = getDieExpr(req, hostname)) {
      try {
        rolled = dice.roll(dieExpr);

        res.ok( rolled.result + "\n" );
      }
      catch (err) {
        // roll doesn't have very good error handling
        if (err instanceof TypeError) {
          res.badRequest(err.message + "\n");
        } else {
          throw err;
        }
      }
    } else {
      // no die expr. given--help?
      res.ok("usage: ...\n");
    }
  }
).listen(2020);

console.log('Ready.');
