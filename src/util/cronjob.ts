import { CronJob } from 'cron';
import { searchChannels } from './twitch';

export const startCronJob = async () => {
    new CronJob(process.env.SCHEDULE || '* * * * *', async () => {
        // @ts-ignore
        const channels = await searchChannels(process.env.TWITCH_USER);
        const channel = channels.data.filter(d => d.display_name === process.env.TWITCH_USER)[0];
        if (channel.is_live) {
            console.log('user is live. turn on light.')
        } else {
            console.log('user is not live. turn off light.')
        }
    }, null, true, process.env.TIMEZONE || 'America/Los_Angeles');
}