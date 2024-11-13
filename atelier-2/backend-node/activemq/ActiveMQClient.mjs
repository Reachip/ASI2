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
    async _ensureConnected() {
        if (this.isConnected) return;
        return new Promise((resolve, reject) => {
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
    }
    async send(destination, message) {
        await this._ensureConnected();
        return new Promise((resolve, reject) => {
            const sendHeaders = {
                destination: destination,
                'content-type': 'text/plain',
            };
            const frame = this.client.send(sendHeaders);
            frame.write(message);
            frame.end();
            resolve();
        });
    }
    async receive(destination, onMessage) {
        await this._ensureConnected();
        const subscribeHeaders = {
            destination: destination,
            ack: 'auto', // Utiliser le mode auto pour éviter l'acquittement manuel
        };
        this.client.subscribe(subscribeHeaders, (error, message) => {
            if (error) {
                console.error('Subscription error:', error.message);
                return;
            }
            message.readString('utf-8', (error, body) => {
                if (error) {
                    console.error('Error reading message:', error.message);
                    return;
                }
                onMessage(body);
            });
        });
    }
}
export default ActiveMQClient;