import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent implements OnInit {
  @Input() loginData = { Username: '', Password: ''};

  showPassword = false; // <-- ADD THIS PROPERTY to control password visibility

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  /**
   * Toggles the visibility of the password input.
   * @memberof UserLoginFormComponent
   */
  toggleShowPassword(): void { // <-- ADD THIS METHOD
    this.showPassword = !this.showPassword;
  }

  /**
   * This method will send the form inputs to the backend
   * @param void
   * @returns user object
   * @memberof UserLoginFormComponent
   * @see FetchApiDataService.userLogin()
   * @example loginUser()
   */
  loginUser(): void {
    this.fetchApiData.userLogin(this.loginData).subscribe((result) => {
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('token', result.token);
      this.dialogRef.close();
      this.snackBar.open('Logged in successfully!', 'OK', { // Updated message for clarity
        duration: 2000
      });
      this.router.navigate(['movies']);
    }, (errorResponse) => { // Changed 'result' to 'errorResponse' for clarity
      console.error('Login failed:', errorResponse); // It's good to log the actual error
      // Assuming the errorResponse might be a string or an object with a message
      const errorMessage = typeof errorResponse === 'string' ? errorResponse : (errorResponse?.error?.message || errorResponse?.message || 'Login failed. Please try again.');
      this.snackBar.open(errorMessage, 'OK', {
        duration: 3000 // Longer duration for errors might be helpful
      });
    });
  }
}