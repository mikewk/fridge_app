import {Component, Input, OnChanges} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, map, Observable, switchMap} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';
import {environment} from "../../environments/environment";

/**
 * This component displays an image from S3.
 * It is required because GraphQL doesn't play nice with cookies
 * So we have to send our authorization to S3 via JWT header.
 */
@Component({
  selector: 'secured-image',
  styles: ['img { width: 100%; height:100%; object-fit: contain; }'],
  template: `
    <img [src]="dataUrl$|async"/>
  `
})
export class SecureImageComponent implements OnChanges {

  // Input from template
  @Input() public src?: string;

  // An observable to wrap our src into
  dataUrl$: Observable<string>;
  private src$

  // The base_url of the server with our images.
  // We're using S3, which requires AuthHeaders, hence this component
  private base_url = environment.image_base_url;

  constructor(private httpClient: HttpClient, private domSanitizer: DomSanitizer) {
    // If we don't have a src, point to a blank image
    if (!this.src) {
      this.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=";
    }
    // Create our observable stream
    this.src$ = new BehaviorSubject(this.src);
    this.dataUrl$ = this.src$.pipe(switchMap(url => this.loadImage(url.toString())));
  }

  ngOnChanges(): void {
    this.src$.next(this.src!);
  }

  private loadImage(url: string): Observable<any> {
    url = this.base_url + url;
    return this.httpClient
      .get(url, {responseType: 'blob'})
      .pipe(map(e => this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(e))))
  }
}
