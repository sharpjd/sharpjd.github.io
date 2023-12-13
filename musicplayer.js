//@ts-check

var musicTracks;
var currentTrack;

/**
 * Plays the background music and picks new tracks. Updated from the sketch.js
 */
class MusicPlayer{

    static initialize(){

        musicTracks = [];

        musicTracks.push(music_AbovePlanets);
        musicTracks.push(music_Cages);
        musicTracks.push(music_LostConstructs);

        currentTrack = MusicPlayer.pickRandomTrack();
        currentTrack.setVolume(0.4);
        currentTrack.play();

    }

    
    static update(){
        if(!currentTrack.isPlaying()){
            currentTrack=null;
        }
        if(currentTrack==null){
            currentTrack = MusicPlayer.pickRandomTrack();
            currentTrack.play();
            console.log("picking new track");
        }
    }
    

    static pickRandomTrack(){
        let i = Math.floor(random(0, musicTracks.length));
        return musicTracks[i];
    }

}