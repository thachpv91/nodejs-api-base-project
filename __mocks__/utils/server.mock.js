/**
 * Mocker the server configuration
 */

import supertest from 'supertest';

import server from '../../src/app';
import '../../src/database';

export default supertest(server);
