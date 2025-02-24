import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { BlogService, BlogPost } from '../../../core/services/blog.service';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-post.component.html'
})
export class BlogPostComponent implements OnInit {
  post: BlogPost | null = null;
  loading = true;
  error = false;

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadPost(id);
    }
  }

  loadPost(id: number) {
    this.loading = true;
    this.blogService.getPost(id).subscribe({
      next: (post) => {
        this.post = post;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'article:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  getPostImage(): string {
    return this.post?._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'assets/images/placeholders/blog-placeholder.jpg';
  }
}
