import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface WordpressPage {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PagesService {
  private readonly apiUrl = environment.urlBlog;

  constructor(private http: HttpClient) {}

  getPages(): Observable<WordpressPage[]> {
    return this.http.get<WordpressPage[]>(`${this.apiUrl}/pages`, {
      params: {
        _embed: 'true'
      }
    });
  }

  getPageSlugs(): Observable<string[]> {
    return this.getPages().pipe(
      map(pages => pages.map(page => page.slug))
    );
  }

  getPageBySlug(slug: string): Observable<WordpressPage> {
    return this.http.get<WordpressPage[]>(`${this.apiUrl}/pages`, {
      params: {
        slug: slug,
        _embed: 'true'
      }
    }).pipe(
      map(pages => {
        if (pages.length === 0) {
          throw new Error('Page not found');
        }
        return pages[0];
      })
    );
  }

  getPageImage(page: WordpressPage): string {
    return page._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'assets/images/placeholders/page-placeholder.jpg';
  }
}
