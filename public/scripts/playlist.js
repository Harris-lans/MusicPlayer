/*
*@ author     : S. Harish Kumar
*@ description: This is the main class of the app that uses the other classes together
*@ copyright  : All rights reserved (C)
*/

import SongFile from './songFile.js';

export default class PlayList
{
    constructor()
    {
        this.songs = [];
    }

    addSongToPlayList(song)
    {
        this.songs.push(song);
    }

    addSongsToPlaylist(songs)
    {
        this.songs = [...this.songs, songs];
    }

    removeSongToPlayList()
    {
        this.songs = this.songs.splice((this.songs.indexOf('foo'), 1 ));
    }
} 