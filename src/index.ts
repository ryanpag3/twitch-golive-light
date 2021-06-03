const dotenv = require('dotenv');
dotenv.config({
    path: '.env'
});
dotenv.config({
    path: '.env.public'
})
import { CronJob } from 'cron';
import Fastify from 'fastify';
import path from 'path';
import { startCronJob } from './util/cronjob';
import { discoverAndCreateUser, getBridge } from './util/philips-hue';
import { getAppToken, searchChannels } from './util/twitch';

const fastify = Fastify();

fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'src/public')
});

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