/*
*@ author     : S. Harish Kumar
*@ description: This is the main class of the app that uses the other classes together
*@ copyright  : All rights reserved (C)
*/ 

import AudioPlayer from './audioPlayer.js';
import PlayList from './playlist.js';
import FireBaseFileStreamer from './fireBaseFileStreamer.js';

export const STORAGE_LOCATION = "";
const SONG_BUTTON_TEMPLATE = `<button type="button" id="@@@" data-name="song-button" class="song-button list-group-item list-group-item-action " value="!!!" >
                                <div class="play-song-button">###</div>
                                <div class="%%% modify-icon" data-value="!!!" data-name="%%%"></div>
                              </button>`;
const ADD_BUTTON_CLASS = "add-to-playlist-button";    
const REMOVE_BUTTON_CLASS = "remove-from-playlist-button";    
const ALL_SONGS = 0;
const PLAYLIST = 1;

class App
{
    constructor()
    {
        this.audioPlayer = new AudioPlayer();
        this.fireBaseFileStreamer = new FireBaseFileStreamer();
        this.currentSongList = null;
        this.songContatiners = [[], []]
        this.currentSelectedSong = null;

        // UI Objects
        this.progressSlider = document.getElementById("audio-file-progress");
        this.albumArt = document.getElementById("album-art");
        this.songList = document.getElementById("song-list");
        this.currentSongName = document.getElementById("current-song");
        this.allSongsCategory = document.getElementById("all-songs-category");
        this.customPlayListCategory = document.getElementById("custom-playlist-category");
        this.currentCategory = this.allSongsCategory;

        this.initializeEventHandlers();

        // Getting the initial song list
        this.getSongList();

        setInterval(() => {
            this.updateUI();
        }, 33);

        // Initially the current song-list is all the songs
        this.currentSongListIndex = ALL_SONGS;
    }

    initializeEventHandlers()
    {
        document.getElementById("play-button").addEventListener('click', () => { this.pauseSong() });
        document.getElementById("previous-button").addEventListener('click', () => { this.previousSong() });
        document.getElementById("next-button").addEventListener('click', () => { this.nextSong() });
        this.allSongsCategory.addEventListener('click', () => { this.selectCategory(this.allSongsCategory, ALL_SONGS) });
        this.customPlayListCategory.addEventListener('click', () => { this.selectCategory(this.customPlayListCategory, PLAYLIST, REMOVE_BUTTON_CLASS) });

        this.songList.addEventListener('click', (event)=> {

            if (event.target.dataset.name == 'song-button')
            {
                this.playSong(parseInt(event.target.value));
            }
            else if (event.target.dataset.name == 'add-to-playlist-button')
            {
                this.addSongToCustomPlayList(parseInt(event.target.dataset.value));
            }

            else if (event.target.dataset.name == 'remove-from-playlist-button')
            {
                this.removeSongFromCustomPlayList(parseInt(event.target.dataset.value));
                event.target.parentNode.remove(event.target);
            }
        });
    }

    updateUI()
    {
        this.progressSlider.style.width = `${this.audioPlayer.getCurrentSongProgress()}%`;
    }

    getSongList()
    {
        this.fireBaseFileStreamer.getMusicList()
        .then(tracks => {
            // Initially showing all songs
            this.songContatiners[this.currentSongListIndex] = tracks;
            this.generateSongsList(this.songContatiners[this.currentSongListIndex], ADD_BUTTON_CLASS);
        })
        .catch(error => {
            // Handle the error
        });
    }

    generateSongsList(songList, sideButtonClass)
    {
        // Generating markups for the song list
        let markup = "";

        songList.forEach(song => {
            
            // Construcing the button by adding in the required details
            let buttonMarkup = SONG_BUTTON_TEMPLATE.replace("###", song.name);
            buttonMarkup = buttonMarkup.replace("!!!", songList.indexOf(song));
            buttonMarkup = buttonMarkup.replace("!!!", songList.indexOf(song));
            buttonMarkup = buttonMarkup.replace("@@@", `song-${songList.indexOf(song)}`);
            buttonMarkup = buttonMarkup.replace("%%%", sideButtonClass);
            buttonMarkup = buttonMarkup.replace("%%%", sideButtonClass);
            markup += buttonMarkup; 
        });

        this.songList.innerHTML = markup;
    }

    addSongToCustomPlayList(songIndex)
    {
        this.songContatiners[PLAYLIST].push(this.songContatiners[ALL_SONGS][songIndex]);
        this.songContatiners[ALL_SONGS][songIndex].inCustomPlaylist = true;
    }

    removeSongFromCustomPlayList(songIndex)
    {
        this.songContatiners[PLAYLIST][songIndex].inCustomPlaylist = false;
        this.songContatiners[PLAYLIST].splice(songIndex, 1);
    }

    selectCategory(category, songListIndex, sideButtonClass = ADD_BUTTON_CLASS)
    {
        this.currentCategory.classList.remove('active');
        this.currentSongListIndex = songListIndex;
        this.generateSongsList(this.songContatiners[this.currentSongListIndex], sideButtonClass);
        this.currentCategory = category;
        this.currentCategory.classList.add('active');
    }

    playSong(songIndex)
    {
        // Updating dispalyed name
        this.currentSongName.innerText = this.songContatiners[this.currentSongListIndex][songIndex].name;
        
        // Updating list highlights
        if(this.currentSelectedSong != null)
        {
            this.currentSelectedSong.classList.remove("active");
        }
        this.currentSelectedSong = document.getElementById(`song-${songIndex}`);
        this.currentSelectedSong.classList.add("active");

        // Getting the file download URL the
        this.fireBaseFileStreamer.getMusicFileURL(this.songContatiners[this.currentSongListIndex][songIndex].fileLocation).then(songURL=>{
            
            this.audioPlayer.playSong(songURL);

            // Listening to the song's end event and playing the next song in the list
            this.audioPlayer.listenToSongEndedEvent(()=>{
                this.nextSong();
            });
        }) 
    }

    pauseSong()
    {
        this.audioPlayer.pauseSong();
    }

    stopSong()
    {
        // Updating dispalyed name
        this.currentSongName.innerText = "";

        this.audioPlayer.stopSong();
    }

    nextSong()
    {
        if (this.currentSelectedSong == null)
        {
            return;
        }

        let currentSongIndex = parseInt(this.currentSelectedSong.value);
        let nextSongIndex = currentSongIndex + 1;
        
        if (nextSongIndex <= this.this.songContatiners[this.currentSongListIndex].length - 1)
        {
            this.playSong(nextSongIndex)
        }

        else 
        {
            this.currentSelectedSong.classList.remove('active');
            this.stopSong();
        }
    }

    previousSong()
    {
        if (this.currentSelectedSong == null)
        {
            return;
        }

        let currentSongIndex = parseInt(this.currentSelectedSong.value);
        let previousSongIndex =  currentSongIndex - 1;

        if (previousSongIndex >= 0)
        {
            this.playSong(previousSongIndex);
        }
        else
        {
            this.playSong(currentSongIndex);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {

    var app = new App();

});