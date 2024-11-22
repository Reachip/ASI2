export default class RetryPlayQueue {
    constructor(redis, id) {
        this.flag = `retryFlag:${id}`;
        this.redis = redis;
    }

    async init() {
        await this.redis.set(this.flag, true);
    }

    async get() {
        return await this.redis.get(this.flag);
    }

    async delete() {
        await this.redis.del(this.flag);
    }
}