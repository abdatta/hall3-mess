import { Schema, HookNextFunction, Document } from 'mongoose';
import { UserModel } from '../models/user.model';
import bcrypt from 'bcrypt';

export let UserSchema: Schema = new Schema({
    name: {type: String, default: ''},
    rollno: {type: String, unique: true, required: true},
    password: {type: String, default: ''},
    email: {type: String}
});

// Generating Password hash
UserSchema.methods.generateHash = function(password: string) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

// Checking if password is valid
UserSchema.methods.validPassword = function(password: string) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.pre('save', function(this: any, next: HookNextFunction) {
    if (!this.email) {
        this.email = `${this.rollno}@iitk.ac.in`;
    }
    next();
});
