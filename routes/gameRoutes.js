var express = require('express');

var routes = function(Game) {
    var gameRouter = express.Router();

    var gameController = require('../controllers/gameController')(Game);
    gameRouter.route('/')
        .post(gameController.post)
        .get(gameController.get)
        .options(gameController.options);

    gameRouter.use('/:gameId', function(req, res, next) {
        Game.findById(req.params.gameId, function(err, game) {
            if(err) {
                res.status(500).send(err);
            } else if(game) {
                req.game = game;
                next();
            } else {
                res.status(404).send('No game found.');
            }
        });
    });

    gameRouter.route('/:gameId')
        .get(gameController.getDetail)
        .put(gameController.putDetail)
        .delete(gameController.deleteDetail)
        .options(gameController.optionsDetail);

    return gameRouter;
};

module.exports = routes;
