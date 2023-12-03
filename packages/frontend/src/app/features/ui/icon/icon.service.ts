import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  private http = inject(HttpClient);
  private cache = new Map<string, string>();

  getIconSvg(name: string): Observable<string> {
    const cachedIcon = this.cache.get(name);
    if (cachedIcon) {
      return of(cachedIcon);
    }

    return this.http
      .get(`assets/icons/${name}.svg`, { responseType: 'text' })
      .pipe(tap(svg => this.cache.set(name, svg)));
  }
}
