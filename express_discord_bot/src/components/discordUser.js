class DiscordUser{
    constructor(id, name, banStatus,muteStatus,deafenStatus){
        this.id = id;
        this.name = name;
        this.status = 'offline';
        this.isBanned = banStatus;
        this.isMuted = muteStatus;
        this.isDeafened = deafenStatus;
    }

    ban(){
        this.isBanned = true;
    }

    unban(){
        this.isBanned = false;
    }

    mute(){
        this.isMuted = true;
    }

    unmute(){
        this.isMuted = false;
    }

    deafen(){
        this.isDeafened = true;
    }

    undeafen(){
        this.isDeafened = false;
    }

    setStatus(status){
        this.status = status;
    }

    getStatus(){
        return this.status;
    }

    getId(){
        return this.id;
    }

    getName(){
        return this.name;
    }

    getIsBanned(){
        return this.isBanned;
    }

    getIsMuted(){
        return this.isMuted;
    }

    
}

export {DiscordUser}