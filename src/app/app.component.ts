import {Component} from '@angular/core';
import {LocalStorageService} from './_services/local-storage.service';
import {Household, User} from "./graphql.types";
import {ItemDialogService} from "./_services/item-dialog.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, Router} from "@angular/router";
import {NEVER, switchMap} from "rxjs";
import {HouseholdService} from "./_graphql-services/household.service";
import {AuthService} from "./_graphql-services/auth.service";
import {SubscriptionHandlerService} from "./_services/subscription-handler-service";
import {v4} from "uuid";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  isFacebookInAppBrowser = () => /FB_IAB/.test(navigator.userAgent) ||
  /FBAN/.test(navigator.userAgent) ||
  /FBAV/.test(navigator.userAgent);

  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  user?: User;
  selectedHousehold?: Household;
  userType: string =  "";
  loading: boolean = true;

  constructor(private localStorageService: LocalStorageService,
              private addFoodItemHandler: ItemDialogService,
              private snackBar: MatSnackBar,
              private route: ActivatedRoute,
              private router: Router,
              private householdService: HouseholdService,
              private authService: AuthService,
              private subHandlerService: SubscriptionHandlerService) {

  }

  private initializeSubscription()
  {
    const token = this.localStorageService.getToken();
    const uuid = this.localStorageService.uuid;
    if( token ) {
      this.subHandlerService.initSubscription(uuid, token);
    }
  }

  onActivate(componentRef: any)
  {
    if( componentRef.loggedIn )
    {
      componentRef.loggedIn.subscribe(()=>
      {
        this.loading = true;
      });
    }
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.localStorageService.getToken();

    this.localStorageService.subscribeUsertype((x:any)=>{this.userType=x; console.log("Usertype Changed to "+x);})

    //Watch window storage to see if we've been logged out
    window.onstorage = () => {
      if( this.localStorageService.getToken() == null ) {
        //oh snap we've been logged out
        this.logout();
      }
    }

    this.localStorageService.getSelectedHouseholdObservable().pipe(switchMap(
        (householdId:number | undefined)=>{
          if( householdId )
            return this.householdService.getHousehold(householdId);
          else
            return NEVER;
        })).subscribe((data)=>
            {
              if( data.households )
                this.selectedHousehold=data.households[0];
              else
                console.log(data);
            });

    if (this.isLoggedIn) {
      //If we're logged in, let's refresh the token
      this.localStorageService.refreshToken();
      this.initializeSubscription();

      //If we're logged in, get our user from localstorage
      this.authService.getUser().subscribe(data=>
      {
        if( data.users )
        {
          this.user = data.users[0];
          if( !this.selectedHousehold )
          {
            //check for default household
            if( this.user.defaultHousehold )
            {
              //Set selected household
              let userType = "member";
              if(this.user.id == this.user.defaultHousehold.owner!.id)
                userType="owner";
              this.localStorageService.switchHousehold(this.user.defaultHousehold.id, userType)
              this.loading=false;
            }
            else {
              this.loading=false;
            }
          }
          else {
            this.loading = false;
          }
        }
      });
    }
    else
    {
      this.loading = false;
    }
  }

  /**
   * Log the user out by telling the token service to Mount Doom the token.
   */
  logout(): void {
    this.localStorageService.signOut();
    window.location.reload();
  }

  /**
   * Show the add item dialog if the Add Item icon is clicked in the toolbar
   * Can be called from anywhere as long as there is a selected household
   */
  addItemToSelected() {
    if (this.selectedHousehold) {
      this.addFoodItemHandler.addItem(this.selectedHousehold).subscribe(
        {
          next: data => {
            //If the API call was successful
            if (data.addFoodItemToStorage) {
              this.snackBar.open("Food Item Added Successfully", undefined,
                {duration: 2000, panelClass: ['simple-snack-bar']});
            } else {
              console.log(data);
            }
          },
          error: err => {
            console.log(err);
          }
        });
    }
  }

  /**
   * Change the selected household to the household picked in the menu
   * @param household
   */
  changeSelected(household: Household) {
    let userType = "member";
    if( household.owner!.id == this.user!.id)
      userType = "owner";
    this.localStorageService.switchHousehold(household.id, userType);
  }

  signup() {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    this.router.navigate(["/register"], {queryParams: {returnUrl: returnUrl}});
  }

  login() {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    this.router.navigate(["/login"], {queryParams: {returnUrl: returnUrl}});
  }
}
