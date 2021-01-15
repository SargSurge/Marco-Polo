const ObjectClass = require('./object');

class Marco extends ObjectClass {
    constructor(id, username, x, y) {
        super(id, x, y, 0, 0);
        this.username = username;
        this.lightBombCooldown = 45;
    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            direction: this.direction,
            lightBombCooldown: this.lightBombCooldown,
        }
    }
}