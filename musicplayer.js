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

        /*
        currentTrack = MusicPlayer.pickRandomTrack();
        currentTrack.setVolume(0.4);
        currentTrack.play();
        */

        this.isFirstTimePickingMusic = true;
    }

    
    static update(){
        if(!currentTrack.isPlaying()){
            currentTrack=null;
        }
        if(currentTrack==null){
            if(this.isFirstTimePickingMusic){
                currentTrack = music_Cages; //this is always the first track played
            } else {
                currentTrack = MusicPlayer.pickRandomTrack();
                console.log("picking new track");
            }
            currentTrack.setVolume(0.4);
            var response = currentTrack.play();
            if (response!== undefined) {
                response.then(_ => {
                    //the sound should start playing
                    this.isFirstTimePickingMusic = false;
                }).catch(error => {
                    //simply handle the rror
                });
            }
        }
    }

    static pickRandomTrack(){
        let i = Math.floor(random(0, musicTracks.length));
        return musicTracks[i];
    }

}