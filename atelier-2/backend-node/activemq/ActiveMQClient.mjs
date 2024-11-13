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
                'content-type': 'application/json',
                'ObjectType': 'fr.cpe.scoobygang.common.activemq.model.MessageActiveMQ'
            };
            const frame = this.client.send(sendHeaders);
            frame.write(JSON.stringify(message));
            frame.end();
            resolve();
        });
    }
}
export default ActiveMQClient;

//'ObjectType': 'fr.cpe.scoobygang.atelier3.api_backend.receiver.MessageActiveMQ'