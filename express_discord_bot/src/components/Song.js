
class Song{
    constructor(title, artist, duration,url,thumbnail, requester){
        this.title = title;
        this.artist = artist;
        this.duration = duration;
        this.url = url;
        this.thumbnail = thumbnail;
        this.requester = requester;
    }

    getMetadata(){
        return `${this.title} by ${this.artist} requested by ${this.requester}`;
    }

    getTitle(){
        return this.title;
    }

    getRequestedBy(){
        return this.requester;
    }

    getThumbnail(){
        return this.thumbnail;
    }
}

export {Song};