const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const config = require("../../config");

function UserService(UserModel){

  let service = {
    create,
    createToken,
    verifyToken,
    findUser,
    authorize,
    findAll,
    findById,
    removeById,
    update
  };

  function create(user) {
    return createPassword(user).then((hashPassword, err) => {
      
      if(err){
        return Promise.reject("Not saved");
      }

      let newUserWithPassword = {
        ...user,
        password: hashPassword,
      };

      let newUser = UserModel(newUserWithPassword);
      return save(newUser);
    });
  }

  function save(model){
    return new Promise(function (resolve, reject) {
      model
      .save()
      .then(() => resolve("User created"))
      .catch((err) => reject(`There is a problem with register ${err}`));
    });
  }

  function createToken(user) {
    let token = jwt.sign(
      { id: user._id, name: user.name, role: user.role.scopes },
      config.secret,
      {
        expiresIn: config.expiresPassword,
      }
    );

    return { auth: true, token };
  }

  function verifyToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          reject();
        }

        return resolve(decoded);
      });
    });
  }

  function findUser({ name, password }){
    return new Promise((resolve, reject) => {
      UserModel.findOne({ name })
        .then((user) => {
          if(!user) return reject("User not found");
          return comparePassword(password, user.password).then((match) =>{
            if(!match) return reject("User not valid");
            return resolve(user);
          });
        })
        .catch((err) => {
          reject(`There is a problem with login ${err}`);
        });
    });
  }

  //retorna passe encriptada
  function createPassword(user) {
    return bcrypt.hash(user.password, config.saltRounds);
  }

  //analisa se a passe enviada corresponde á passe encriptada
  function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  function authorize(scopes) {
     return (request, response, next) => {
      const { roleUser } = request;
      console.log("route scopes:", scopes);
      console.log("user scopes:", roleUser);

      const hasAuthorization = scopes.some((scope) => roleUser.includes(scope));

      if (roleUser && hasAuthorization){
        next();
      } else {
        response.status(403).json({ message: "Forbidden" });
      }
    }; 
  }

  function findAll() {
    return new Promise(function (resolve, reject){
        UserModel.find({})
        .then((users) => resolve(users))
        .catch((err) => reject(err));
    });
  }

  function findById(id) {
    return new Promise(function (resolve, reject){
        UserModel.findById(id)
        .then((user) => resolve(user))
        .catch((err) => reject(err));
    });
  }

  function update(id, user) {
    return new Promise(function (resolve, reject){
        UserModel.findByIdAndUpdate(id, user)
        .then(() => resolve(user))
        .catch((err) => reject(err));
    });
}

  function removeById(id) {
    return new Promise(function (resolve, reject){
        UserModel.findByIdAndDelete(id)
        .then(() => resolve())
        .catch((err) => reject(err));
    });
}

  return service;
}

module.exports = UserService;
