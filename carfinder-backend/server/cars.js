const bodyParser = require('body-parser');
const express = require('express');
const Cars = require("../data/cars");
const Users = require("../data/users");
const scopes = require("../data/users/scopes");
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const CarRouter = () => {
  let router = express();

  router.use(bodyParser.json({ limit: '100mb' }));
  router.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
  router.use(cors());

  function authenticateToken(req, res, next) {
    let token = req.headers['x-access-token'];

    //Erro se não houver token (apenas para rotas privadas)
    if (!token) {
      return res
        .status(400)
        .send({ auth: false, message: "No token provided." })
    }
    //Verifica se o token é válido
    Users.verifyToken(token)
      .then((decoded) => {
        console.log("-=> Valid Token <=-");
        console.log("DECODED->" + JSON.stringify(decoded, null, 2));
        req.roleUser = decoded.role;
        next();
      })
      .catch(() => {
        res.status(401).send({ auth: false, message: "Not authorized" });
      });
  }

  // Rota para obter todos os carros
  router
    .route('/cars')
    .get(function (req, res, next) {
      console.log('get all cars');

      const query = req.query.q; // Termo de pesquisa
      const sortBy = req.query.sortBy;

      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 12;

      Cars.findAll(query, sortBy, page, pageSize)
        .then((result) => {
          const cars = result.cars;
          const totalPages = result.totalPages;
          const currentPage = result.currentPage;

          console.log(cars);
          res.json({
            cars: cars,
            totalPages: totalPages,
            currentPage: currentPage
          });
          next();
        })
        .catch((err) => {
          console.log(err);
          next();
        });
    });


  // Configurando Multer
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Diretório onde as imagens serão armazenadas
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Nome único para cada arquivo
    },
  });

  const upload = multer({ storage: storage });

  // Rota para criar carro
  router
    .route("/createCar")
    .post(authenticateToken, Users.authorize([scopes["admin"]]), upload.single('image')
      , function (req, res, next) {
        console.log('post');

        let body = req.body;
        if (req.file) {
          body.image = req.file.path
        }

        Cars.create(body)
          .then(() => {
            console.log("Carro criado");
            res.status(200);
            res.send(body);
            next();
          })
          .catch((err) => {
            console.log('Carro já existe!');
            res.status = err.status || 500;
            res.send(401);
            next();
          });
      });

  // Rota para obter informações de um carro pelo seu id
  router
    .route("/cars/:carId")
    .get(function (req, res, next) {
      console.log("Carro obtido pelo id com sucesso!");
      let carId = req.params.carId;

      Cars.findById(carId)
        .then((car) => {
          res.status(200);
          res.send(car);
          next();
        })
        .catch((err) => {
          res.status(404);
          next();
        });
    })// Rota para atualizar um carro
    .put(authenticateToken, Users.authorize([scopes["admin"]]),
      function (req, res, next) {
        console.log("Carro atualizado com sucesso");
        let carId = req.params.carId;
        let body = req.body;

        Cars.update(carId, body)
          .then((car) => {
            res.status(200);
            res.send(car);
            next();
          })
          .catch((err) => {
            res.status(404);
            console.log(err);
            next();
          });
      })// Rota para eliminar um carro
    .delete(authenticateToken, Users.authorize([scopes["admin"]]),
      function (req, res, next) {
        console.log("Carro removido com sucesso!");
        let carId = req.params.carId;

        Cars.removeById(carId)
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

  // Rota para comparar dois carros
  router.route('/comparar')
    .get(function (req, res) {
      const { carId1, carId2 } = req.query;

      Promise.all([Cars.findById(carId1), Cars.findById(carId2)])
        .then(([car1, car2]) => {
          if (!car1 || !car2) {
            res.status(404).send('Um ou ambos os carros não foram encontrados');
            return;
          }

          const comparison = {
            car1: car1,
            car2: car2,
          };

          res.status(200).json(comparison);
        })
        .catch((err) => {
          res.status(500).send(err.message);
        });
    });

  router.route('/carros')
    .put(function (req, res) {
      console.log('put');
      res.send('put');
    });

  return router;

}

module.exports = CarRouter;
