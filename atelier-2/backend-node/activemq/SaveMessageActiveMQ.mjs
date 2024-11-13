import ActiveMQClient from './ActiveMQClient.mjs';
class SaveMessageActiveMq
{
    constructor() {
        this.client = new ActiveMQClient();
        this.queueName = 'queue.save.message';
    }

    async sendMessage(message) {
        try {
            await this.client.send(this.queueName, message);
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error.message);
        }
    }

}
export default SaveMessageActiveMq;