import stompit from 'stompit';
class ActiveMQClient {
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
                            console.log("Connected successfully!");
                            this.client = client;
                            this.isConnected = true;

                            // Gérer les erreurs
                            this.client.on('error', (err) => {
                                console.error('Connection error:', err.message);
                                this.isConnected = false;
                                this._ensureConnected().catch((err) =>
                                    console.error('Reconnection failed:', err.message)
                                );
                            });

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
                await new Promise((res) => setTimeout(res, 2000));
            }
        }
    }

    async send(destination, message, objectType) {
        await this._ensureConnected();
        return new Promise((resolve, reject) => {
            const sendHeaders = {
                destination: destination,
                'content-type': 'application/json',
                'ObjectType': objectType,
            };
            const frame = this.client.send(sendHeaders);
            frame.write(JSON.stringify(message));
            frame.end();
            resolve();
        });
    }

    disconnect() {
        if (this.client) {
            this.client.disconnect(() => {
                console.log("Disconnected from ActiveMQ");
                this.isConnected = false;
            });
        }
    }
}
export default ActiveMQClient;