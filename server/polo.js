const ObjectClass = require('./object');

class Polo extends ObjectClass {
    constructor(id, username, x, y) {
        super(id, x, y, 0, 0);
        this.username = username;
        this.teleportBombCooldown = 45;
    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            direction: this.direction,
            teleportBombCooldown: this.teleportBombCooldown,
        }
    }
}