/* eslint-disable import/no-mutable-exports */

import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const UserSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            required: [true, 'Email is required!'],
            trim: true,
            validate: {
                validator(email) {
                    const emailRegex = /^[-a-z0-9%S_+]+(\.[-a-z0-9%S_+]+)*@(?:[a-z0-9-]{1,63}\.){1,125}[a-z]{2,63}$/i;
                    return emailRegex.test(email);
                },
                message: '{VALUE} is not a valid email!',
            },
        },
        name: {
            type: String,
            trim: true,
        },
        username: {
            type: String,
            trim: true,
            unique: true,
        },
    },
    { timestamps: true },
);

UserSchema.plugin(uniqueValidator, {
    message: '{VALUE} already taken!',
});
let User;
try {
    User = mongoose.model('User');
} catch (e) {
    User = mongoose.model('User', UserSchema);
}
export default User;
