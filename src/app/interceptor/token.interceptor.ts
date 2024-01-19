import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
// import jwt_decode from 'jwt-decode';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor() {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const clientId = '0592eb8f-4c88-45a5-8172-237227f08295'; // Your client ID
        const tokenInfoString = localStorage.getItem(`msal.token.keys.${clientId}`);
        console.log('interceptor')
        if (tokenInfoString !== null) {
            const tokenInfo = JSON.parse(tokenInfoString);
    
            if (tokenInfo.accessToken) {
                const accessToken = tokenInfo.accessToken[0]; 

                const secret = localStorage.getItem(accessToken)
                if(secret !== null){
                    const secretInfo = JSON.parse(secret)
                    localStorage.setItem('accessToken', secretInfo.secret)
                    // this.decodeToken()
                    console.log(secretInfo)
                    const cloneReq = req.clone({
                        // headers: req.headers.set('Authorization', 'Bearer ' + secretInfo.secret)
                        setHeaders:{
                            Authorization: `Bearer ${secretInfo.secret}`,
                        }
                    });
                    return next.handle(cloneReq);
                }
            }
        }
    
        return next.handle(req);
    }

    // decodeToken(){
    //     const token = localStorage.getItem('accessToken')
    //     if (token != null) {
    //     //deserialize Token JWT
    //     const decodedToken: any = jwt_decode(token);
    //     // this.role = decodedToken.role
    //     // this.username = decodedToken.userName
    //     // this.estateId = decodedToken.estateId
    //     // this.companyId = decodedToken.companyId

    //   //check jwt expired time
    // //   const currentTime = new Date().getTime()
    // //   //*1000 to convert milisecond
    // //   if (decodedToken.exp * 1000 < currentTime) {
    // //     this.router.navigateByUrl('/login')
    // //     return of(false)
    // //   }
    // //   else {
    // //     this.getUser(this.estateId, this.companyId)
    //   }
    // }
    
    
    
}