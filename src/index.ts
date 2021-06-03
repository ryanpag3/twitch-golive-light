const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.public' })
import Fastify from 'fastify';
import { startCronJob } from './util/cronjob';

const fastify = Fastify();

const start = async () => {
    try {
        await startCronJob();
        await fastify.listen(process.env.PORT || 3000);
        console.log(`Started fastify server.`);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

start();