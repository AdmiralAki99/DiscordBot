class Logger{
    constructor(){
        this.logs = [];
    }

    log(message,user){
        let log = {
            'level':'info',
            'message':message
            ,'timestamp':new Date().toISOString()
            ,'user': user
        }
    }

    logSongEnqueue(message,user){
        let log = {
            'level':'song_enqueue',
            'message':message
            ,'timestamp':new Date().toISOString(),
            'user': user
        }

        this.logs.push(log);
    }

    logPlaylistSearched(message,user){
        let log = {
            'level':'playlist_searched',
            'message':message
            ,'timestamp':new Date().toISOString(),
            'user':user
        }
        this.logs.push(log);
    }

    logSongDequeue(message,user){
        let log = {
            'level':'song_dequeue',
            'message':message
            ,'timestamp':new Date().toISOString(),
            'user':user
        }
        this.logs.push(log);
    }

    logUserMute(message,user){
        let log = {
            'level':'user_mute',
            'message':message
            ,'timestamp':new Date().toISOString(),
            'user':user
        }
        this.logs.push(log);
    }

    logUserUnmute(message,user){
        let log = {
            'level':'user_unmute',
            'message':message
            ,'timestamp':new Date().toISOString(),
            'user':user
        }
        this.logs.push(log);
    }

    logUserDeafen(message,user){
        let log = {
            'level':'user_deafen',
            'message':message
            ,'timestamp':new Date().toISOString(),
            'user':user
        }
        this.logs.push(log);
    }

    logUserUndeafen(message,user){
        let log = {
            'level':'user_undeafen',
            'message':message
            ,'timestamp':new Date().toISOString(),
            'user':user
        }
        this.logs.push(log);
    }

    logUserKick(message,user){
        let log = {
            'level':'user_kick',
            'message':message
            ,'timestamp':new Date().toISOString(),
            'user':user
        }
        this.logs.push(log);
    }

    logSongFinish(message,user){
        let log = {
            'level':'song_finish',
            'message':message
            ,'timestamp':new Date().toISOString(),
            'user':user
        }
        this.logs.push(log);
    }

    logSongSkip(message,user){
        let log = {
            'level':'song_skip',
            'message':message
            ,'timestamp':new Date().toISOString(),
            'user':user
        }
        this.logs.push(log);
    }

    logSongPause(message,user){
        let log = {
            'level':'song_pause',
            'message':message
            ,'timestamp':new Date().toISOString(),
            'user':user
        }
        this.logs.push(log);
    }

    logSongResume(message,user){
        let log = {
            'level':'song_resume',
            'message':message
            ,'timestamp':new Date().toISOString(),
            'user':user
        }
        this.logs.push(log);
    }

    logSongSearch(message,user){
        let log = {
            'level':'song_search',
            'message':message
            ,'timestamp':new Date().toISOString(),
            'user':user
        }
        this.logs.push(log);
    }

    logSongStop(message,user){
        let log = {
            'level':'song_stop',
            'message':message
            ,'timestamp':new Date().toISOString(),
            'user':user
        }
        this.logs.push(log);
    }

    clearLog(){
        this.logs = []
    }

    getLogs(){
        return this.logs;
    }
}

export {Logger}