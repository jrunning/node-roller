node-roller
===========

A die-rolling app because of reasons. Made with [Connect][].

[Connect]: <https://github.com/senchalabs/connect> "senchalabs/connect"


Usage
-----

Basic usage:

    $ curl http://4d6+1.roller.local:2020/
    12

JSON output:

    $ curl -H "Content-Type: application/json" http://4d6+1.roller.local:2020/

    # or

    $ curl http://4d6+1.json.roller.local:2020/
    {"input":{"quantity":"4","sides":"6","transformations":["sum",["add","1"]]},"calculations":[18,17,[4,5,3,5]],"rolled":[4,5,3,5],"result":18}


Todo
----

* All the things.
