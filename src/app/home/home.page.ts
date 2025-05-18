import { Component } from '@angular/core';

interface LocalTrack {
  title: string;
  artist: string;
  albumArt?: string;
  path: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage {
  searchQuery: string = '';
  localTracks: LocalTrack[] = [];
  audioPlayer: HTMLAudioElement | null = null;
  currentTrack: LocalTrack | null = null;
  isPlaying: boolean = false;

  constructor() {}

  async ionViewWillEnter() {
    await this.loadLocalTracks();
  }

  async loadLocalTracks() {
    this.localTracks = [
      {
        title: 'HANDS UP',
        artist: 'MEOVV',
        albumArt: 'assets/icon/meovv.png',
        path: '/assets/music/MEOVV - HANDS UP.mp3',
      },
      {
        title: 'poppop',
        artist: 'NCT WISH',
        albumArt: 'assets/icon/poppop1.png',
        path: '/assets/music/NCT WISH - poppop.mp3',
      },
    ];
  }

  async playLocalTrack(track: LocalTrack) {
    // If clicking on the currently playing track and it's playing, pause it instead
    if (this.currentTrack === track && this.isPlaying) {
      this.pauseTrack();
      return;
    }

    // If clicking on the currently playing track and it's paused, resume it
    if (this.currentTrack === track && !this.isPlaying && this.audioPlayer) {
      this.resumeTrack();
      return;
    }

    // Otherwise, play a new track

    // Stop any currently playing track
    if (this.audioPlayer) {
      this.audioPlayer.pause();
    }

    this.audioPlayer = new Audio(track.path);
    this.currentTrack = track;

    this.audioPlayer.play();
    this.isPlaying = true;

    this.audioPlayer.onended = () => {
      console.log(`Finished playing ${track.title}`);
      this.isPlaying = false;
      this.currentTrack = null;
    };

    this.audioPlayer.onerror = (err) => {
      console.error('Playback error:', err);
      this.isPlaying = false;
      this.currentTrack = null;
    };
  }

  pauseTrack() {
    if (this.audioPlayer && this.isPlaying) {
      this.audioPlayer.pause();
      this.isPlaying = false;
    }
  }

  resumeTrack() {
    if (this.audioPlayer && !this.isPlaying) {
      this.audioPlayer.play();
      this.isPlaying = true;
    }
  }

  stopTrack() {
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioPlayer.currentTime = 0;
      this.isPlaying = false;
      this.currentTrack = null;
    }
  }

  onSearch() {
    if (!this.searchQuery.trim()) {
      alert('Search query is empty!');
      return;
    }
    console.log('Searching for:', this.searchQuery);
  }
}
