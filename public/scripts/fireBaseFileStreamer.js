/*
*@ author     : S. Harish Kumar
*@ description: This app is used to 
*@ copyright  : All rights reserved (C)
*/

import { to } from './utils.js';

export default class FireBaseFileStreamer
{   
    constructor()
    {
        this.initializeFireBaseApp();

        // Get a reference to the database service
        this.storage = firebase.storage();
        this.database = firebase.firestore();
        this.database.settings({
            timestampsInSnapshots: true
        });
        console.log("Firestore initialized...")
    }
    
    initializeFireBaseApp()
    {
        // Initialize Firebase
        var config = {
            apiKey: "AIzaSyB-7CLEnVPRXoavDjBdXVu4CEL8YKMD5q4",
            authDomain: "music-player-4cdde.firebaseapp.com",
            databaseURL: "https://music-player-4cdde.firebaseio.com",
            projectId: "music-player-4cdde",
            storageBucket: "music-player-4cdde.appspot.com",
            messagingSenderId: "1099187264708"
        };
        firebase.initializeApp(config);
        console.log("Firebase initialized...");
    }

    async getMusicFileURL(filePath)
    {
        let storageRef = this.storage.ref();

        let [error, data] = await to(storageRef.child(filePath).getDownloadURL());

        if (error) {
            throw new Error(error);
        }

        return data;
    }
    
    async getMusicList()
    {
        let documentRef = this.database.collection("music");

        let [error, data] = await to(documentRef.get());

        if (error) {
            throw new Error(error);
        }
        
        let tracks = [];
        data.forEach(el => {
            tracks.push({ id: el.id, ...el.data()})
        });

        return tracks;
        
    }
}