import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, limit: number = 100, ellipsis: string = '...'): SafeHtml {
    if (value.length <= limit) {
      return this.sanitizer.bypassSecurityTrustHtml(value);
    }
    const truncatedText = value.slice(0, limit) + ellipsis;
    return this.sanitizer.bypassSecurityTrustHtml(truncatedText);
  }
}