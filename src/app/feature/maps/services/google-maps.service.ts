import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  private readonly apiKey: string = environment.googleMapsApiKey;
  private readonly apiUrl: string = 'https://maps.googleapis.com/maps/api/js';

  private isLoaded = signal<boolean>(false);
  isGoogleMapsLoaded = computed(this.isLoaded);
  private loadingPromise: Promise<void> | null = null;
  private readonly libraries: string[] = ['maps', 'marker'];

  loadGoogleMaps(): Promise<void> {
    if (this.isLoaded()) {
      return Promise.resolve();
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = new Promise<void>((resolve, reject) => {
      // Resolve promise in initGoogleMap callback to fix "TypeError: google.maps.importLibrary is not a function" error
      (window as any).initGoogleMap = () => {
        this.isLoaded.set(true);
        resolve();
      };

      const scriptEl: HTMLScriptElement = document.createElement('script');
      scriptEl.src = `${ this.apiUrl }?key=${ this.apiKey }&callback=initGoogleMap&loading=async&libraries=${ this.libraries.join(',') }`;
      scriptEl.async = true;
      scriptEl.defer = true;
      scriptEl.onerror = reject;

      document.head.appendChild(scriptEl);
    });

    return this.loadingPromise;
  }
}



