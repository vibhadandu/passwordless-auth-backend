# Passwordless Authentication

This is POW concept of authorizing users without the need of a password.

## The 3 routes

### `1. /signup `

Users login using this route. They make their account by providing meta data. But more importantly, by providing their email address that will then be used to make mail them a `special link`

### `2. /identify `

Users signin using this route. They provide their email. If the user is signed up, they recieve and email with an uuid and this login attempt is stored for verification.

### `3. /verify `

User then verify by clicking on the link in their mails, which will call this route. If the user has attempted to login and their uuids match, this means the auth was successful.

### How to run

Make sure you have nodeJS installed

```
npm install
npm start
```

#### Reference

https://www.youtube.com/watch?v=XaTMNb0ess8
