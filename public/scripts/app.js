/*
*@ author     : S. Harish Kumar
*@ description: This is the main class of the app that uses the other classes together
*@ copyright  : All rights reserved (C)
*/ 

import AudioPlayer from './audioPlayer.js';
import PlayList from './playlist.js';
import FireBaseFileStreamer from './fireBaseFileStreamer.js';

export const STORAGE_LOCATION = "";

class App
{
    constructor()
    {
        this.audioPlayer = new AudioPlayer();
        this.fireBaseFileStreamer = new FireBaseFileStreamer();
        this.playLists = {};
        this.allSongs = [];
        this.currentSelectedSong = null;

        // UI Objects
        this.progressSlider = document.getElementById("audio-file-progress");
        this.albumArt = document.getElementById("album-art");

        this.fireBaseFileStreamer.test();
    }

    update()
    {
        // TODO: Update UI
    }

    createPlayList(nameOfPlayList)
    {
        this.playLists[nameOfPlayList] = new PlayList();
    }

    deletePlayList(nameOfPlayList)
    {
        delete this.playLists[nameOfPlayList];
    }

    selectPlayList()
    {

    }

    playSong()
    {

    }

    pauseSong()
    {

    }

    fastForwardSong()
    {

    }

    rewindSong()
    {

    }

    nextSong()
    {

    }

    previousSong()
    {

    }
}

document.addEventListener("DOMContentLoaded", () => {

    var app = new App();

});