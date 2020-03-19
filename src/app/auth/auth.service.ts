import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
    kind: string,
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: boolean;
}
@Injectable({ providedIn: 'root' })
export class AuthService {
    private tokenExpirationTimer : any;
    user = new BehaviorSubject<User>(null);

    constructor(private http: HttpClient,
        private router: Router) {

    }

    signUp(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAnRVljwA4m6AT53mTxVD3gs0S9J-SLXO8',
            {
                email: email,
                password: password,
                returnSecureToken: true
            })
            .pipe(catchError(this.handleError

            ), tap(resData => {
                this.handleUserAuthentication(resData.email,
                    resData.localId, resData.idToken, +resData.expiresIn)
            }));
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAnRVljwA4m6AT53mTxVD3gs0S9J-SLXO8',
            {
                email: email,
                password: password,
                returnSecureToken: true
            })
            .pipe(catchError(this.handleError), tap(resData => {
                this.handleUserAuthentication(resData.email,
                    resData.localId, resData.idToken, +resData.expiresIn)
            }));
    }

    private handleUserAuthentication(email: string,
        userId: string,
        token: string,
        expireIn: number) {
        const expirationDate = new Date(new Date().getTime() + expireIn * 1000);
        const user = new User(email,
            userId, token, expirationDate);
        this.user.next(user);
        this.autoLogOut(expireIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));

    }

    autoLogin() {
        const userData: {
            email: string,
            id: string,
            token: string,
            tokenExpirationDate: Date
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            return;
        }

        const loadedUser = new User(userData.email, userData.id,
            userData.token, userData.tokenExpirationDate);

            if(!loadedUser.Token){
                this.user.next(loadedUser);
                const expirationDuration = new Date(
                    userData.tokenExpirationDate
                ).getTime() - new Date().getTime();
                this.autoLogOut(expirationDuration);
            }
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An Unknown Error Occurred!';
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This Email Already Exist';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'Email Does Not Exist';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'This Password is not Correct';
                break;
        }

        return throwError(errorMessage);


    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if(this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer =null;
    }

    autoLogOut(expirationDuration : number){
        setTimeout(()=>{
            this.logout();
        },
        expirationDuration
        
        );
    }
}