import Fastify from 'fastify';
import path from 'path';

const fastify = Fastify();

fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'src/public')
});

const start = async () => {
    try {
        console.log('starting twitch golive light server.');
        await fastify.listen(process.env.PORT || 3000);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

start();