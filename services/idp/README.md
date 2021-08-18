# IDP Service
How IDP (Identity Provider) works:

* IDP use [PassportJs](http://www.passportjs.org/) (local + mongoose) for user authentication.
* Once the user authenticated, IDP provides an access-token JWT ([JSON Web Token](https://jwt.io/)) and refresh-token JWT.
* Access token can be used across all services that familiar with server secret.
* JWT (state-less) used as replacement to server session (state-full) that can not be used on distributed architecture.
* Access token is time limited (few minutes normally).
* Refresh token used for generating new access token once it's expired.
* When refresh token used for generating a new access token, IDP check if refresh token exists in DB, if not, the request is forbidden (403), this give the ability to kick unwanted users from server side.


IDP sequence diagram:
![alt text](design/TokensFlow.png)