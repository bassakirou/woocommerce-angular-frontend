import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-archive-blog-skeleton',
  standalone: true,
  templateUrl: './archive-blog-skeleton.component.html',
})
export class ArchiveBlogSkeletonComponent {
  @Input() cardSkeleton = false;
  @Input() listSkeleton = false;
  @Input() gridSkeleton = false;
  @Input() categoriesSkeleton = false;

}
