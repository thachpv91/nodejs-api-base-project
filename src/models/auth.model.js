import mongoose, { Schema } from 'mongoose';

const constants = {
    AUTH_EMAIL: 0,
    AUTH_TRIPLE: 1
};

const authSchema = new Schema({
    userID: { type: Schema.ObjectId, ref: 'User' },
    authMethod: { type: Number, default: constants.AUTH_EMAIL },
    extra1: { type: String },
    extra2: { type: String },
    extra3: { type: String },
    extra4: { type: String }
});

// eslint-disable-next-line import/no-mutable-exports
let Auth;
try {
    Auth = mongoose.model('Auth');
} catch (e) {
    Auth = mongoose.model('Auth', authSchema);
}
export default Auth;
