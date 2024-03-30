- forget password process

- user sends request to /forgot-password with his email or username => done for email , edit it for username.
- check if user exists in our db. => DONE for email, edit it for username.
- generate a random jwtToken , store it in the database and send it in email to the user.
- when the user click the link in the email they recieve , he will be redirected to our system with the token, then he will be asked for his new password.
- sends a request with the token , password, passwordConfirm to reset the password via /reset-password endpoint.
- verify the token & its expiration data.
- delete the token from the database.



- create Verification Token upon registeration && mark the emailVerified field as false && block the user from logging in. =>DONE
- send this token in email to the user included in a redirect url. =>DONE
- extract the token from the url and verify the token and its expire.
- mark the emailVerified field as true.
- allow user to log in.

- ejs templates for emails.
- fix password-reset passsword hash issue.
- handle error when user tries to login with email or username that does not exist.