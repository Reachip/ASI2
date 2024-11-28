import ActiveMQClient from './ActiveMQClient.mjs';
import {OBJECT_TYPE_GAME_TRANSACTION_ACTIVEMQ} from "../utils/constants.mjs";
class SaveGameTransactionActiveMq
{
    constructor() {
        this.client = new ActiveMQClient();
        this.queueName = 'queue.game.transaction';
    }

    async sendMessage(message) {
        try {
            await this.client.send(this.queueName, message , OBJECT_TYPE_GAME_TRANSACTION_ACTIVEMQ);
            console.log(`Message envoyé dans queue :  ${this.queueName}, ${JSON.stringify(message)}`);
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error.message);
        }
    }

}
export default SaveGameTransactionActiveMq;