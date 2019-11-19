import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import config from 'config';

import tripleWalletService from './triple-wallet.service';
import User from '../models/user.model';
import Auth from '../models/auth.model';

const authenticationConfig = config.get('authentication');
/**
 * Local Strategy Auth
 */
const localOpts = { usernameField: 'email' };

const localLogin = new LocalStrategy(
    localOpts,
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            return done(null, user);
        } catch (e) {
            return done(e, false);
        }
    },
);

/**
 * Local Strategy Auth
 */
const tripleLoginOpts = { usernameField: 'userCode' };
const tripleLogin = new LocalStrategy(
    tripleLoginOpts,
    async (email, password, done) => {
        try {
            const loginWithTriple = await tripleWalletService.login(email, password);
            const user = await User.findOne({ email });
            if (loginWithTriple.success) {
                return done(null, user);
            }
            return done(null, user);
        } catch (e) {
            return done(e, false);
        }
    },
);

/**
 * JWT Strategy Auth
 */
const jwtOpts = {
    // Telling Passport to check authorization headers for JWT
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
    // Telling Passport where to find the secret
    secretOrKey: authenticationConfig.secret,
};

const jwtLogin = new JWTStrategy(jwtOpts, async (payload, done) => {
    try {
        const user = await User.findById(payload._id);

        if (!user) {
            return done(null, false);
        }

        return done(null, user);
    } catch (e) {
        return done(e, false);
    }
});

passport.use('local', localLogin);
passport.use('tripleAuth', tripleLogin);
passport.use('jwt', jwtLogin);

export const authLocal = passport.authenticate('local', { session: false });
export const authTriple = passport.authenticate('tripleAuth', { session: false });
export const authJwt = passport.authenticate('jwt', { session: false });
