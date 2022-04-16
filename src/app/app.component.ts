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

/**
 * The main application component
 */
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

  /**
   * Initialize subscription with Websocket
   * @private
   */
  private initializeSubscription()
  {
    const token = this.localStorageService.getToken();
    const uuid = this.localStorageService.uuid;
    if( token ) {
      this.subHandlerService.initSubscription(uuid, token);
    }
  }

  /**
   * Get messages from the login or registration pages
   * @param componentRef
   */
  onActivate(componentRef: any)
  {
    if( componentRef.loggedIn ) {
      componentRef.loggedIn.subscribe(()=>
      {
        this.loading = true;
      });
    }
  }

  /**
   * Set up our app
   */
  ngOnInit(): void {
    // check if we're logged in
    this.isLoggedIn = !!this.localStorageService.getToken();

    //Subscripe to usertype so we can show the appropriate menus
    this.localStorageService.subscribeUsertype((x:any)=>{this.userType=x; console.log("Usertype Changed to "+x);})

    //Watch window storage to see if we've been logged out
    window.onstorage = () => {
      if( this.localStorageService.getToken() == null ) {
        //oh snap we've been logged out
        this.logout();
      }
    }

    // Watch the currently selected household and get the new household if it changes
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
      //If we're logged in when the app loads, let's refresh the token
      this.localStorageService.refreshToken();
      this.initializeSubscription();

      //If we're logged in, get our user from localstorage
      this.authService.getUser().subscribe(data=> {
        if( data.users ) {
          this.user = data.users[0];
          if( !this.selectedHousehold ) {
            //check for default household
            if( this.user.defaultHousehold ) {
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
    else {
      this.loading = false;
    }
  }

  /**
   * Log the user out by telling the token service to Mount Doom local and session storage
   */
  logout(): void {
    this.localStorageService.signOut();
    window.location.reload();
  }

  /**
   * Show the add item dialog if the Add Item icon is clicked in the toolbar
   * Can be called from anywhere as long as there is a selected household
   */
  addItemToSelected(event: Event) {
    let input = event.target as HTMLInputElement;
    if( input.files && input.files.length > 0) {
      if (this.selectedHousehold) {
        this.addFoodItemHandler.addItem(this.selectedHousehold, input.files[0]).subscribe(
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
      input.value = "";
    }
  }

  /**
   * Change the selected household to the household picked in the menu
   * The rest of the code will pick up this change via Observable
   * @param household
   */
  changeSelected(household: Household) {
    let userType = "member";
    if( household.owner!.id == this.user!.id)
      userType = "owner";
    this.localStorageService.switchHousehold(household.id, userType);
  }

  /**
   * Go to signup page if they click signup button
   * Save the current returnURL
   */
  signup() {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    this.router.navigate(["/register"], {queryParams: {returnUrl: returnUrl}});
  }

  /**
   * Go to login page if they click login button
   * Save the current returnURL
   */
  login() {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    this.router.navigate(["/login"], {queryParams: {returnUrl: returnUrl}});
  }
}
