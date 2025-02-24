import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface BlogPost {
  id: number;
  date: string;
  title: {
    rendered: string;
  };
  excerpt: {
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
export class BlogService {
  private readonly apiUrl = environment.urlBlog;

  constructor(private http: HttpClient) {}

  getPosts(page: number = 1, perPage: number = 10): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`${this.apiUrl}/posts`, {
      params: {
        page: page.toString(),
        per_page: perPage.toString(),
        _embed: 'true' // Pour inclure les médias
      }
    });
  }

  getPost(id: number): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.apiUrl}/posts/${id}`, {
      params: {
        _embed: 'true'
      }
    });
  }
}
