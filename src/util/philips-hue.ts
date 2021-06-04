const hueApi = require('node-hue-api');

export const getBridge = async () => {
    const results = await hueApi.discovery.nupnpSearch();
    console.log(results);
}

const appName = 'node-hue-api';
const deviceName = 'example-code';

export async function discoverBridge() {
    const discoveryResults = await hueApi.discovery.nupnpSearch();

    if (discoveryResults.length === 0) {
        console.error('Failed to resolve any Hue Bridges');
        return null;
    } else {
        // Ignoring that you could have more than one Hue Bridge on a network as this is unlikely in 99.9% of users situations
        return discoveryResults[0].ipaddress;
    }
}

export async function discoverAndCreateUser() {
    const ipAddress = await discoverBridge();

    // Create an unauthenticated instance of the Hue API so that we can create a new user
    const unauthenticatedApi = await hueApi.v3.api.createLocal(ipAddress).connect();

    let createdUser;
    try {
        createdUser = await unauthenticatedApi.users.createUser(appName, deviceName);
        console.log('*******************************************************************************\n');
        console.log('User has been created on the Hue Bridge. The following username can be used to\n' +
            'authenticate with the Bridge and provide full local access to the Hue Bridge.\n' +
            'YOU SHOULD TREAT THIS LIKE A PASSWORD\n');
        console.log(`Hue Bridge User: ${createdUser.username}`);
        console.log(`Hue Bridge User Client Key: ${createdUser.clientkey}`);
        console.log('*******************************************************************************\n');

        // Create a new API instance that is authenticated with the new user we created
        const authenticatedApi = await hueApi.v3.api.createLocal(ipAddress).connect(createdUser.username);

        // Do something with the authenticated user/api
        const bridgeConfig = await authenticatedApi.configuration.getConfiguration();
        console.log(`Connected to Hue Bridge: ${bridgeConfig.name} :: ${bridgeConfig.ipaddress}`);

    } catch (err) {
        if (err.getHueErrorType() === 101) {
            console.error('The Link button on the bridge was not pressed. Please press the Link button and try again.');
        } else {
            console.error(`Unexpected Error: ${err.message}`);
        }
    }
}

export async function connectToBridge() {
    const ipAddress = await discoverBridge();
    const user = process.env.HUE_USER;
    return await hueApi.v3.api.createLocal(ipAddress).connect(user);
}

export async function turnOnStreamLight() {
    const bridge = await connectToBridge();
    const LightState = hueApi.v3.lightStates.LightState;
    const state = new LightState()
        .on();
    const lights = await bridge.lights.getLightByName(process.env.STREAM_LIGHT || 'StreamLight');
    lights.forEach((light: any) => {
        bridge.lights.setLightState(light.id, state);
    });
}

export async function turnOffStreamLight() {
    const bridge = await connectToBridge();
    const LightState = hueApi.v3.lightStates.LightState;
    const state = new LightState()
        .off();
    const lights = await bridge.lights.getLightByName(process.env.STREAM_LIGHT || 'StreamLight');
    lights.forEach((light: any) => {
        bridge.lights.setLightState(light.id, state);
    });
}