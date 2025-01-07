const bodyParser = require("body-parser");
const express = require("express");
const Users = require("../data/users");

function AuthRouter() {
  let router = express();

  router.use(bodyParser.json({ limit: "100mb" }));
  router.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

  // Rota para registrar utilizador
  router.route("/register").post(function (req, res, next) {
    const body = req.body;
    console.log("User:", body);
    Users.create(body)
      .then(() => Users.createToken(body))
      .then((response) => {
        res.status(200);
        console.log("User token: ", response);
        res.send(response);
      })
      .catch((err) => {
        res.status(500);
        res.send(err);
        next();
      });
  });

  // Rota para obter dados do utilizador autenticado
  router.route("/me").get(function (req, res, next) {
    let token = req.cookies['authToken']; // Buscar o token no cookie

    if (!token) {
      return res
        .status(401)
        .send({ auth: false, message: "No token provided." });
    }

    return Users.verifyToken(token)
      .then((decoded) => {
        console.log(decoded);
        res.status(202).send({ auth: true, decoded });
      })
      .catch((err) => {
        res.status(500);
        res.send(err);
        next();
      });
  });

  // Rota de login com cookies
  router.route("/login").post(function (req, res, next) {
    let body = req.body;
    console.log("Login for user:", body);

    return Users.findUser(body)
      .then((user) => {
        return Users.createToken(user);
      })
      .then((token) => {
        // Configurar o cookie com o token
        res.cookie('authToken', token, {
          maxAge: 3600000, 
          httpOnly: true, 
          secure: process.env.NODE_ENV === 'production', 
        });

        res.status(200).send({ auth: true, message: "Login bem-sucedido." });
      })
      .catch((err) => {
        res.status(500).send(err);
        next();
      });
  });

  // Rota de logout para limpar o cookie
  router.route("/logout").post(function (req, res) {
    res.clearCookie('authToken'); // Remover o cookie
    res.status(200).send({ auth: false, message: "Logout realizado." });
  });  

  return router;
}

module.exports = AuthRouter;
