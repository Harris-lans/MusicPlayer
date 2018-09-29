/*
*@ author     : S. Harish Kumar
*@ description: This is the main class of the app that uses the other classes together
*@ copyright  : All rights reserved (C)
*/

export default class AudioPlayer
{
    constructor()
    {
        this.currentlyPlayingSong = null;
        
    }

    playSong(songURL)
    {
        if (this.currentlyPlayingSong != null)
        {
            this.currentlyPlayingSong.stop();
        }
        this.currentlyPlayingSong = new buzz.sound(songURL);
        this.currentlyPlayingSong.play();
    }

    pauseSong()
    {
        if (this.currentlyPlayingSong != null)
        {
            this.currentlyPlayingSong.togglePlay();
        }
    }

    stopSong()
    {
        if (this.currentlyPlayingSong != null)
        {
            this.currentlyPlayingSong.stop();
        }
    }

    getCurrentSongProgress()
    {
        let currentPogress = 0;
        
        if (this.currentlyPlayingSong != null)
        {
            currentPogress = this.currentlyPlayingSong.getPercent();
        }

        return currentPogress;
    }

    isCurrentSongOver()
    {
        return this.currentlyPlayingSong
    }

    listenToSongEndedEvent(callback)
    {
        if (this.currentlyPlayingSong != null)
        {
            this.currentlyPlayingSong.bind('ended', callback);
        }
    }
}