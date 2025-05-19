import { Component } from '@angular/core';
import { SpotifyService } from '../services/spotify.services'; // make sure this path and filename is correct

interface LocalTrack {
  title: string;
  artist: string;
  albumArt?: string;
  path: string;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
  preview_url: string | null;
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
  spotifyTracks: SpotifyTrack[] = [];
  audioPlayer: HTMLAudioElement | null = null;
  currentTrack: LocalTrack | SpotifyTrack | null = null;
  isPlaying: boolean = false;
  isCurrentTrackLocal: boolean = true;
  errorMessage: string = '';

  constructor(private spotifyService: SpotifyService) {}

  async ionViewWillEnter() {
    await this.loadLocalTracks();
    // Fetch Spotify Playlist (Replace with your Playlist ID)
  this.spotifyService.getPlaylist('04iXPz5GTV2D7XsmGWaO65').subscribe({
    next: (data) => {
      console.log('Playlist Details:', data); // Debugging
      this.spotifyTracks = data.tracks.items.map((item: any) => item.track); // Map to track list
    },
    error: (error) => {
      console.error('Error fetching playlist:', error);
      this.errorMessage = 'Failed to fetch playlist.';
    }
  });
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
    this.isCurrentTrackLocal = true;
    await this.playAudio(track.path, track);
  }

  async playSpotifyTrack(track: SpotifyTrack) {
    if (!track.preview_url) {
      alert('Preview not available for this track.');
      return;
    }
    this.isCurrentTrackLocal = false;
    await this.playAudio(track.preview_url, track);
  }
  async searchSpotifyTracks() {
    if (!this.searchQuery.trim()) {
      this.spotifyTracks = []; // Clear results if the query is empty
      return;
    }
  
    try {
      const response = await this.spotifyService.searchTracks(this.searchQuery).toPromise()
      this.spotifyTracks = response.tracks.items; // Assign the tracks to spotifyTracks
      console.log('Spotify tracks:', this.spotifyTracks); // Debugging
    } catch (error) {
      this.errorMessage = 'Failed to fetch Spotify tracks. Please try again.';
      console.error(error);
    }
  }

  private async playAudio(source: string, track: LocalTrack | SpotifyTrack) {
    if (this.currentTrack === track && this.isPlaying) {
      this.pauseTrack();
      return;
    }
    if (this.currentTrack === track && !this.isPlaying && this.audioPlayer) {
      this.resumeTrack();
      return;
    }
    if (this.audioPlayer) {
      this.audioPlayer.pause();
    }
    this.audioPlayer = new Audio(source);
    this.currentTrack = track;

    try {
      await this.audioPlayer.play();
      this.isPlaying = true;
    } catch (err) {
      console.error('Playback error:', err);
      this.isPlaying = false;
      this.currentTrack = null;
    }

    this.audioPlayer.onended = () => {
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
    this.errorMessage = '';
    if (!this.searchQuery.trim()) {
      alert('Search query is empty!');
      return;
    }
    this.spotifyService.searchTracks(this.searchQuery).subscribe({
      next: (res: any) => {
        this.spotifyTracks = res.tracks.items;
      },
      error: (err: any) => {
        this.errorMessage = err;
        this.spotifyTracks = [];
      },
    });
  }

  // New helper getters to safely get title and artist
  getCurrentTrackTitle(): string {
    if (!this.currentTrack) return '';
    if ('title' in this.currentTrack) {
      return this.currentTrack.title;
    } else if ('name' in this.currentTrack) {
      return this.currentTrack.name;
    }
    return '';
  }
  
  getCurrentTrackArtist(): string {
    if (!this.currentTrack) return '';
    if ('artist' in this.currentTrack) {
      return this.currentTrack.artist;
    } else if ('artists' in this.currentTrack && this.currentTrack.artists.length) {
      return this.currentTrack.artists.map(a => a.name).join(', ');
    }
    return 'Unknown Artist';
  }
  
  getSpotifyArtists(track: SpotifyTrack): string {
    if (!track.artists || track.artists.length === 0) {
      return 'Unknown Artist';
    }
    return track.artists.map(a => a.name).join(', ');
  }
  get nowPlayingTitle(): string {
    if (!this.currentTrack) return '';
    // Local track
    if ('title' in this.currentTrack) return this.currentTrack.title;
    // Spotify track
    if ('name' in this.currentTrack) return this.currentTrack.name;
    return '';
  }
  
  get nowPlayingArtist(): string {
    if (!this.currentTrack) return '';
    // Local track
    if ('artist' in this.currentTrack) return this.currentTrack.artist;
    // Spotify track
    if ('artists' in this.currentTrack && Array.isArray(this.currentTrack.artists)) {
      return this.currentTrack.artists.map((a: any) => a.name).join(', ');
    }
    return '';
  }
  
}
