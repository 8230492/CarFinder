const bodyParser = require('body-parser');
const express = require('express');
const Users = require("../data/users");
const scopes = require("../data/users/scopes");

const UserstRouter = () => {
  let router = express();

  router.use(bodyParser.json({ limit: '100mb' }));
  router.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

  function authenticateToken(req, res, next) {
    let token = req.headers['x-access-token'];

    //Verifica se a rota é pública
    /*if(publicRoutes.includes(req.originalUrl)){
      return next();
    }*/

    //Erro se não houver token (apenas para rotas privadas)
    if(!token){
        return res
            .status(400)
            .send({ auth: false, message: "No token provided."})
    }
    //Verifica se o token é válido
    Users.verifyToken(token)
        .then((decoded) => {
            console.log("-=> Valid Token <=-");
            console.log("DECODED->" + JSON.stringify(decoded, null, 2));
            req.roleUser = decoded.role;
            next();
        })
        .catch(() =>{
          res.status(401).send({ auth: false, message: "Not authorized"});
        });
  }

  router
    .route('/users')
    .get(authenticateToken, Users.authorize([scopes["admin"]]),
      function (req, res, next) {
        console.log('get all users');
        Users.findAll()
          .then((users) => {
            console.log(users);
            res.send(users);
            next();
          })
          .catch((err) => {
            console.log(err);
            next();
        });
    });

  router
  .route("/users/:userId")    
  .get(authenticateToken, Users.authorize([scopes["admin"]]),
    function (req, res, next) {
      console.log("get a user by id");
      let userId = req.params.userId;

      Users.findById(userId)
        .then((user) => {
          res.status(200);
          res.send(user);
          next();
        })
        .catch((err) => {
          res.status(404);
          next();
        });
  })
  .put(authenticateToken, Users.authorize([scopes["admin"]]),
    function(req, res, next) {
      console.log("Update a user by id");
      let userId = req.params.userId;
      let body = req.body;

      Users.update(userId, body)
        .then((user) => {
          res.status(200);
          res.send(user);
          next();
        })
        .catch((err) => {
          res.status(404);
          console.log(err);
          next();
        });
  })
  .delete(authenticateToken, Users.authorize([scopes["admin"]]),
    function(req, res, next) {
      console.log("Delete a user by id");
      let userId = req.params.userId;

      Users.removeById(userId)
        .then(() => {
          res.status(200);
          res.send();
          next();
        })
        .catch((err) => {
          res.status(404);
          console.log(err);
          next();
        });
  });

  router.route('/userManagement')
        .put(function (req, res) {
            console.log('put');
            res.send('put');
        });

  return router;
}

module.exports = UserstRouter;