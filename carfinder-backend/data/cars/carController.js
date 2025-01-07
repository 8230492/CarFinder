function CarController(CarModel) {
  let controller = {
    create,
    findAll,
    findById,
    update,
    removeById
  }

  function create(values) {
    let newCar = CarModel(values);
    return save(newCar);
  }

  function save(newCar) {
    return new Promise(function (resolve, reject) {
      newCar.save()
        .then(() => resolve('Car created'))
        .catch((err) => reject(err));
    });
  }

  function findAll(query, sortBy, page = 1, pageSize = 12) {
    let findQuery = {};

    if (query) {
      findQuery = {
        $or: [
          { model: { $regex: query, $options: 'i' } },
          { brand: { $regex: query, $options: 'i' } }
        ]
      };
    }

    const skip = (page - 1) * pageSize; // Calcula o deslocamento dos documentos
    const limit = pageSize; // Limita o número de documentos por página

    return new Promise(function (resolve, reject) {
      // Primeiro, contar o número total de documentos que correspondem à consulta
      CarModel.countDocuments(findQuery)
        .then(totalItems => {
          const totalPages = Math.ceil(totalItems / pageSize);

          // Em seguida, buscar os documentos com paginação
          CarModel.find(findQuery)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .then(cars => {
              resolve({
                cars: cars,
                totalItems: totalItems,
                totalPages: totalPages,
                currentPage: page
              });
            })
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }

  function findById(id) {
    return new Promise(function (resolve, reject) {
      CarModel.findById(id)
        .then((car) => resolve(car))
        .catch((err) => reject(err));
    });
  }

  function update(id, car) {
    return new Promise(function (resolve, reject) {
      CarModel.findByIdAndUpdate(id, car)
        .then(() => resolve(car))
        .catch((err) => reject(err));
    });
  }

  function removeById(id) {
    return new Promise(function (resolve, reject) {
      CarModel.findByIdAndDelete(id)
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  }

  return controller;

}

module.exports = CarController;
