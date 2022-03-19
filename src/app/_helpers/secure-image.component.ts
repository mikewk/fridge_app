import { Component, Input, OnChanges } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, BehaviorSubject, switchMap, map} from 'rxjs';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {environment} from "../../environments/environment";

@Component({
  selector: 'secured-image',
  styles: ['img { width: 100%; }'],
  template: `
    <img [src]="dataUrl$|async"/>
  `
})
export class SecureImageComponent implements OnChanges  {
  // This part just creates an rxjs stream from the src
  // this makes sure that we can handle it when the src changes
  // or even when the component gets destroyed
  @Input() public src?: string;
  private src$
  private base_url = environment.image_base_url;
  ngOnChanges(): void {
    this.src$.next(this.src!);
  }

  // this stream will contain the actual url that our img tag will load
  // everytime the src changes, the previous call would be canceled and the
  // new resource would be loaded
  dataUrl$: Observable<string>;

  // we need HttpClient to load the image and DomSanitizer to trust the url
  constructor(private httpClient: HttpClient, private domSanitizer: DomSanitizer) {
    //If we don't have a src, point to a blank image
    if( !this.src ) {
      this.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=";
    }
    this.src$ = new BehaviorSubject(this.src);
    this.dataUrl$ = this.src$.pipe(switchMap(url => this.loadImage(url.toString())));
  }

  private loadImage(url: string): Observable<any> {
    url = this.base_url+url;
    return this.httpClient
      .get(url, {responseType: 'blob'})
      .pipe(map(e => this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(e))))
  }
}
