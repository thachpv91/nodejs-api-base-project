/* eslint-disable no-console */

/**
 * Configuration for the database
 */

import mongoose from 'mongoose';
import config from 'config';

// Remove the warning with Promise
mongoose.Promise = global.Promise;

const mongodbConfig = config.get('mongodb');
// If debug run the mongoose debug options
mongoose.set('debug', mongodbConfig, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Connect the db with the url provide
try {
    mongoose.connect(mongodbConfig.uri);
} catch (err) {
    mongoose.createConnection(mongodbConfig.uri);
}

mongoose.connection
    .once('open', () => console.log('MongoDB Running'))
    .on('error', e => {
        throw e;
    });
