
class Song{
    constructor(title, artist, duration,url,thumbnail){
        this.title = title;
        this.artist = artist;
        this.duration = duration;
        this.url = url;
        this.thumbnail = thumbnail;
    }

    getMetadata(){
        return `${this.title} by ${this.artist}`;
    }
}

export {Song};