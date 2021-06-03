import axios from 'axios';

/**
 * Uses twitch client credentials flow to obtain an app token.
 */
export const getAppToken = async (): Promise<string> => {
    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;

    const { data }: {
        data: {
            access_token: string;
            refresh_token: string;
            expires_in: number;
            scope: string[];
            token_type: string;
        }
    } = await axios.post(`https://id.twitch.tv/oauth2/token`, null, {
        params: {
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: `client_credentials`
        }
    });

    console.log(`got app token`);

    return data.access_token;
}

export const searchChannels = async (query: string) => {
    const token = await getAppToken();
    const { data }: {
        data: {
            data: {
                broadcaster_language: string;
                broadcaster_login: string;
                display_name: string;
                game_id: string;
                game_name: string;
                id: string;
                tags_ids: string[],
                thumbnail_url: string;
                title: string;
                started_at: string;
                is_live: boolean;
            }[];
            pagination: {
                cursor: string;
            }
        }
    } = await axios.get(`https://api.twitch.tv/helix/search/channels`, {
        params: {
            query
        },
        headers: {
            'Authorization': 'Bearer ' + token,
            'Client-Id': process.env.TWITCH_CLIENT_ID
        }
    });

    console.log(`got channels ${data.data.length}`);
    console.log(data.data);
    
    return data;
}