import {Component} from '@angular/core';
import {TokenStorageService} from './_services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  email?: string;
  name?: string;
  id?: number;

  constructor(private tokenStorageService: TokenStorageService) {
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.email = user.email;
      this.name = user.name;
      this.id = user.id
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
