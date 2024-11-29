import stompit from 'stompit';
class ActiveMQClient
{
    constructor() {
        this.host = "localhost";
        this.port = 61613;
        this.username = "myuser";
        this.password = "mypwd";
        this.client = null;
        this.isConnected = false;
    }
    async _ensureConnected(retries = 3) {
        if (this.isConnected) return;
        let attempts = 0;
        while (attempts < retries) {
            try {
                return await new Promise((resolve, reject) => {
                    const connectOptions = {
                        host: this.host,
                        port: this.port,
                        connectHeaders: {
                            host: '/',
                            login: this.username,
                            passcode: this.password,
                            'heart-beat': '5000,5000',
                        },
                    };

                    stompit.connect(connectOptions, (error, client) => {
                        if (error) {
                            reject(error);
                        } else {
                            this.client = client;
                            this.isConnected = true;
                            resolve();
                        }
                    });
                });
            } catch (error) {
                attempts++;
                if (attempts >= retries) {
                    throw new Error(`Failed to connect after ${retries} retries: ${error.message}`);
                }
                console.warn(`Connection attempt ${attempts} failed. Retrying...`);
                await new Promise((res) => setTimeout(res, 2000)); // Pause avant nouvel essai
            }
        }
    }

    async send(destination, message, objectType) {
        await this._ensureConnected();
        return new Promise((resolve, reject) => {
            const sendHeaders = {
                destination: destination,
                'content-type': 'application/json',
                'ObjectType': objectType
            };
            const frame = this.client.send(sendHeaders);
            frame.write(JSON.stringify(message));
            frame.end();
            resolve();
        });
    }
}
export default ActiveMQClient;