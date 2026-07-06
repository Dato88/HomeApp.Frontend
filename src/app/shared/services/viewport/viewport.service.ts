import { Injectable, Signal, signal } from '@angular/core';

/**
 * matchMedia-basierte Viewport-Signals für Strukturwechsel per @if
 * (z. B. Tabellen- vs. Karten-Ansicht). Werte müssen mit
 * src/styles/_breakpoints.scss übereinstimmen ($bp-sm 600, $bp-lg 900).
 */
@Injectable({ providedIn: 'root' })
export class ViewportService {
  readonly isPhone = this.watch('(max-width: 599.98px)');
  readonly isTablet = this.watch('(max-width: 899.98px)');
  readonly isDesktop = this.watch('(min-width: 900px)');

  private watch(query: string): Signal<boolean> {
    // jsdom (Unit-Tests) implementiert matchMedia nicht — Desktop als Default.
    if (typeof window.matchMedia !== 'function') {
      return signal(query.startsWith('(min-width')).asReadonly();
    }

    const mediaQueryList = window.matchMedia(query);
    const matches = signal(mediaQueryList.matches);
    mediaQueryList.addEventListener('change', event => matches.set(event.matches));
    return matches.asReadonly();
  }
}
