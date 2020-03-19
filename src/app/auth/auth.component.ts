import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoginMode = true;
  isLoading = false;
  constructor(private authService: AuthService,
    private router : Router) { }
  error: string = null;
  ngOnInit() {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm): void {
    const email = form.value.email;
    const pwd = form.value.password;

    let authObs : Observable<AuthResponseData>;
    if (!form.valid) {
      return;
    }

    this.isLoading = true;
    if (this.isLoginMode) {
     authObs =  this.authService.login(email, pwd)
    } else {
      authObs = this.authService.signUp(email, pwd)
    }
    authObs.subscribe(
      resData => {
        console.log(resData)
        this.isLoading = false;
        this.router.navigate(['/recipe'])
      },
      errorMessage => {

        this.error = errorMessage;
        this.isLoading = false;
      });
    form.reset();
  }
}
