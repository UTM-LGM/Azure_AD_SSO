import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatListModule } from '@angular/material/list'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { MsalModule, MsalRedirectComponent, MsalGuard, MsalInterceptor } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { AuthInterceptor } from './interceptor/token.interceptor';

const isIe = 
window.navigator.userAgent.indexOf("MSIE ") > -1 ||
window.navigator.userAgent.indexOf("Trident/") > -1;

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    HttpClientModule,
    MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          clientId: "0592eb8f-4c88-45a5-8172-237227f08295",
          authority: "https://login.microsoftonline.com/22f0712b-5def-4d21-a16e-30e5e334541e",
          redirectUri:"http://localhost:4200",
        },
        cache:{
          cacheLocation:"localStorage",
          storeAuthStateInCookie: isIe,
        }
      }),
      {
        interactionType: InteractionType.Redirect,
        authRequest: {
          // scopes: ["user.read"],
          scopes: [
            // "api://54bd939c-b9d6-41c9-a04f-179b4c72de52/.default",
            // "api://54bd939c-b9d6-41c9-a04f-179b4c72de52/Forecast.Read",
            // "api://e-estateAPI/.default"
            "api://e-EstateAPI2/.default"
          ],
        },
      },
      {
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map([
          ["https://graph.microsoft.com/v1.0/me", ["user.read"]],
          // ["api://54bd939c-b9d6-41c9-a04f-179b4c72de52", ["Forecast.Read"]],
        ])
      }
    ),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    MsalGuard
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
