import { Component, Inject, inject } from '@angular/core';
import { MsalBroadcastService, MsalService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'azure-ad';
  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>()

  constructor(
    @Inject(MSAL_GUARD_CONFIG)
    private msalGuardConfig: MsalGuardConfiguration,
    private authservice: MsalService,
    private broadCastService: MsalBroadcastService,
  ){}

  ngOnInit(){
    this.isIframe = window !== window.parent && !window.opener;

    this.broadCastService.inProgress$
    .pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      takeUntil(this._destroying$)
    )
    .subscribe(() => {
      this.setLoginDisplay()
    })
  }

  logout(){
    this.authservice.logoutRedirect({
      postLogoutRedirectUri: 'http://localhost:4200/'
    })
  }

  login(){
    if(this.msalGuardConfig.authRequest){
      this.authservice.loginRedirect({...this.msalGuardConfig.authRequest as RedirectRequest});
    } else{
      this.authservice.loginRedirect();
    }
  }

  setLoginDisplay(){
    this.loginDisplay = this.authservice.instance.getAllAccounts().length > 0;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
