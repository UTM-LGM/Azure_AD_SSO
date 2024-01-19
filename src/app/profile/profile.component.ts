import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';

type ProfileType = {
  givenName?: string,
  surname?: string,
  userPrincipalName?: string
  id?: string
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profile!: ProfileType;

  constructor(
    private http: HttpClient
  ){}

  ngOnInit(){
    this.getProfile();
    this.getForecast();
  }

  getProfile(){
    this.http.get(GRAPH_ENDPOINT)
    .subscribe(profile => {
      this.profile = profile
    })
  }

  getForecast(){
    this.http.get("https://localhost:7069/weatherforecast").subscribe(
      res => {
        console.log(res)
      }
    )
  }
}
