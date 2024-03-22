- forget password process

- user sends request to /forgot-password with his email or username
- check if user exists in our db.
- generate a random jwtToken , store it in the database and send it in email to the user.
- when the user click the link in the email they recieve , he will be redirected to our system with the token, then he will be asked for his new password.
- sends a request with the token , password, passwordConfirm to reset the password via /reset-password endpoint.
- verify the token & its expiration data.
- delete the token from the database.