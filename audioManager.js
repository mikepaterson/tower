class AudioManager {

  audio = {};
  mute = false;

  load(src) {
    if(!this.audio[src]) {
      this.audio[src] = [];
    }

    this.audio[src].push(new Audio(src));
  }


  play(src) {
    if(this.mute) {
      return;
    }

    if(!this.audio[src]) {
      this.load(src);
    }

    var audio = this.audio[src].find(audio => audio.duration === 0 || audio.paused);

    if(!audio) {
      this.load(src);
      audio = this.audio[src].find(audio => audio.duration === 0 || audio.paused);
    }

    if(audio) {
      audio.volume = 0.25;
      audio.play();
    }

  }


  isMuted() {
    return this.mute;
  }

  toggleMute() {
    this.mute = !this.mute;
  }

}