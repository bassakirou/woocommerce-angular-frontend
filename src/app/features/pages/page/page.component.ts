import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { PagesService, WordpressPage } from '../../../core/services/pages.service';
import { ArchiveBlogSkeletonComponent } from '../../../shared/components/skeleton/archive-blog-skeleton/archive-blog-skeleton.component';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ArchiveBlogSkeletonComponent],
  templateUrl: './page.component.html'
})
export class PageComponent implements OnInit {
  page: WordpressPage | null = null;
  loading = true;
  error = false;
  notFound = false;

  constructor(
    public pagesService: PagesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.loadPage(slug);
      }
    });
  }

  loadPage(slug: string) {
    this.loading = true;
    this.error = false;
    this.notFound = false;

    this.pagesService.getPageBySlug(slug).subscribe({
      next: (page) => {
        this.page = page;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la page:', error);
        this.error = true;
        this.notFound = error.message === 'Page not found';
        this.loading = false;
      }
    });
  }

  getPageImage(): string {
    return this.page ? this.pagesService.getPageImage(this.page) : '';
  }
}
