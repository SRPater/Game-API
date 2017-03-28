var gameController = function(Game) {

    var post = function(req, res) {
        var game = new Game(req.body);

        if(!req.body.title || !req.body.year || !req.body.genre) {
            res.status(400).send('Please fill in all fields!');
        } else {
            game.save(function(err) {
                if(err) {
                    res.status(500).send(err);
                } else {
                    var returnGame = game.toJSON();
                    returnGame._links = {};
                    returnGame._links.self = {};
                    returnGame._links.self.href = 'http://' + req.headers.host + '/api/games/' + returnGame._id;
                    returnGame._links.collection = {};
                    returnGame._links.collection.href = 'http://' + req.headers.host + '/api/games/';

                    res.status(201).json(returnGame);
                }
            });
        }
    };

    var get = function(req, res) {
        if (!req.accepts('application/json')) {
            res.status(400).send('Unaccepted format.');
        } else {
            Game.find({}, function(err, games) {
                if(err) {
                    res.status(500).send(err);
                } else {
                    var collection = {};
                    collection.items = [];
                    var collectionLink = 'http://' + req.headers.host + '/api/games/';

                    var count = 0;
                    var start, limit;

                    games.forEach(function(element, index, array) {
                        if(count == 0) {
                            if(req.query.start) {
                                start = parseInt(req.query.start);
                            } else {
                                start = 1;
                            }

                            if(req.query.limit) {
                                limit = parseInt(req.query.limit);
                            } else {
                                limit = games.length;
                            }
                        }

                        count++;
                        var newGame = element.toJSON();
                        newGame._links = {};
                        newGame._links.self = {};
                        newGame._links.self.href = collectionLink + newGame._id;
                        newGame._links.collection = {};
                        newGame._links.collection.href = collectionLink;

                        if((count >= start) && (collection.items.length < limit)) {
                            collection.items.push(newGame);
                        }
                    });

                    collection._links = {};
                    collection._links.self = {};
                    collection._links.self.href = collectionLink;

                    collection.pagination = {};
                    collection.pagination.currentItems = collection.items.length;
                    collection.pagination.currentPage = Math.ceil(start / limit);
                    collection.pagination.totalItems = games.length;
                    collection.pagination.totalPages = Math.ceil(games.length / limit);

                    collection.pagination._links = {};
                    collection.pagination._links.first = {};

                    collection.pagination._links.first.page = 1;
                    collection.pagination._links.first.href = 'http://' + req.headers.host + '/api/games?limit=' + limit;

                    collection.pagination._links.last = {};
                    collection.pagination._links.last.page = collection.pagination.totalPages;
                    collection.pagination._links.last.href = 'http://' + req.headers.host + '/api/games?start=' + (games.length - limit + 1) + '&limit=' + limit;

                    collection.pagination._links.previous = {};
                    if(collection.pagination.currentPage > 1) {
                        collection.pagination._links.previous.page = collection.pagination.currentPage - 1;
                        collection.pagination._links.previous.href = 'http://' + req.headers.host + '/api/games?start=' + (start - limit) + '&limit=' + limit;
                    } else {
                        collection.pagination._links.previous.page = 1;
                        collection.pagination._links.previous.href = 'http://' + req.headers.host + '/api/games?limit=' + limit;
                    }

                    collection.pagination._links.next = {};
                    if(collection.pagination.currentPage < collection.pagination.totalPages) {
                        collection.pagination._links.next.page = collection.pagination.currentPage + 1;
                        collection.pagination._links.next.href = 'http://' + req.headers.host + '/api/games?start=' + (start + limit) + '&limit=' + limit;
                    } else {
                        collection.pagination._links.next.page = collection.pagination.totalPages;
                        collection.pagination._links.next.href = 'http://' + req.headers.host + '/api/games?start=' + (games.length - limit + 1) + '&limit=' + limit;
                    }

                    res.json(collection);
                }
            });
        }
    };

    var options = function(req, res) {
        res.header('Allow', 'POST, GET, OPTIONS');
        res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
        res.status(200).send();
    };

    var getDetail = function(req, res) {
        var returnGame = req.game.toJSON();
        returnGame._links = {};
        returnGame._links.self = {};
        returnGame._links.self.href = 'http://' + req.headers.host + '/api/games/' + returnGame._id;
        returnGame._links.collection = {};
        returnGame._links.collection.href = 'http://' + req.headers.host + '/api/games/';
        res.json(returnGame);
    };

    var putDetail = function(req, res) {
        if (!req.body.title || !req.body.year || !req.body.genre) {
            res.status(400).send('Please fill in all fields!');
        } else {
            req.game.title = req.body.title;
            req.game.year = req.body.year;
            req.game.genre = req.body.genre;
            req.game.save(function(err) {
                if(err) {
                    res.status(500).send(err);
                } else {
                    var returnGame = req.game.toJSON();
                    returnGame._links = {};
                    returnGame._links.self = {};
                    returnGame._links.self.href = 'http://' + req.headers.host + '/api/games/' + returnGame._id;
                    returnGame._links.collection = {};
                    returnGame._links.collection.href = 'http://' + req.headers.host + '/api/games/';
                    res.json(returnGame);
                }
            });
        }
    };

    var deleteDetail = function(req, res) {
        req.game.remove(function(err) {
            if(err) {
                res.status(500).send(err);
            } else {
                res.status(204).send('Game removed');
            }
        });
    };

    var optionsDetail = function(req, res) {
        res.header('Allow', 'GET, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
        res.status(200).send();
    };

    return {
        post: post,
        get: get,
        options: options,

        getDetail: getDetail,
        putDetail: putDetail,
        deleteDetail: deleteDetail,
        optionsDetail: optionsDetail
    }

};

module.exports = gameController;
