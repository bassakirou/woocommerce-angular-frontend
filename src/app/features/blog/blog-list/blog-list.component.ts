import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BlogService, BlogPost } from '../../../core/services/blog.service';
import { ArchiveBlogSkeletonComponent } from "../../../shared/components/skeleton/archive-blog-skeleton/archive-blog-skeleton.component";
import { TruncatePipe } from "../../../shared/pipes/truncate.pipe";

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ArchiveBlogSkeletonComponent, TruncatePipe],
  templateUrl: './blog-list.component.html'
})
export class BlogListComponent implements OnInit {
  posts: BlogPost[] = [];
  loading = true;
  error = false;

  constructor(private blogService: BlogService) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.loading = true;
    this.blogService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des articles:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  getPostImage(post: BlogPost): string {
    return post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'assets/images/placeholders/blog-placeholder.jpg';
  }
}
