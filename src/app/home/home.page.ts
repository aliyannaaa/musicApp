import { Component } from '@angular/core';
import { Media } from '@capacitor-community/media';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

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

  // Load local music files when the page is loaded
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
    // Stop any currently playing track
    if (this.audioPlayer) {
      this.audioPlayer.pause();
    }

    // Initialize a new audio instance
    this.audioPlayer = new Audio(track.path);
    this.audioPlayer.play();

    this.audioPlayer.onended = () => {
      console.log(`Finished playing ${track.title}`);
    };

    this.audioPlayer.onerror = (err) => {
      console.error('Playback error:', err);
    };
  }
  pauseTrack() {
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.isPlaying = false;
    }
  }

  resumeTrack() {
    if (this.audioPlayer) {
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
