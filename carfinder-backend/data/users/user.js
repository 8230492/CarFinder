let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let scopes = require('./scopes');

let RoleSchema = new Schema({
    name: {type: String, required:true},
    scopes: [{type: String, enum:[scopes["client"], scopes["admin"]]}]
});

let UserSchema = new Schema({
    userName: {type: String, required: true, unique: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: { type: RoleSchema },
    favoriteCars: [{ type: Schema.Types.ObjectId, ref: 'Car' }]
});

let User = mongoose.model("User", UserSchema);

module.exports = User;
