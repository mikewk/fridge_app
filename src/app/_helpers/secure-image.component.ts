import { Component, Input, OnChanges } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, BehaviorSubject, switchMap, map} from 'rxjs';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'secured-image',
  template: `
    <img [src]="dataUrl$|async"/>
  `
})
export class SecureImageComponent implements OnChanges  {
  // This part just creates an rxjs stream from the src
  // this makes sure that we can handle it when the src changes
  // or even when the component gets destroyed
  @Input() public src!: SafeResourceUrl;
  private src$ = new BehaviorSubject(this.src);
  ngOnChanges(): void {
    this.src$.next(this.src);
  }

  // this stream will contain the actual url that our img tag will load
  // everytime the src changes, the previous call would be canceled and the
  // new resource would be loaded
  dataUrl$ = this.src$.pipe(switchMap(url => this.loadImage(url.toString())));

  // we need HttpClient to load the image and DomSanitizer to trust the url
  constructor(private httpClient: HttpClient, private domSanitizer: DomSanitizer) {
  }

  private loadImage(url: string): Observable<any> {
    return this.httpClient
      .get(url, {responseType: 'blob'})
      .pipe(map(e => this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(e))))
  }
}
