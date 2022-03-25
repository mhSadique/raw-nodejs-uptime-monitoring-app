 // 1. start an api server that will listen to a port and accept incoming http requests like GET, PUT, POST, DELETE 
 // 2. the api will be connceted to a client, create new user and then edit or delete the user
 // 3. the api will allow the user to sign in and implement token based authentication
 // 4. user can log out and at that time the token will invalidated
 // 5. logged in user can check if his links have go down or up. user can also determine what up or down means to him
 // 6. user can edit/delete links and adding the number of links will be limited to a number
 // 7. set a background process that will monitor the links on certain interval if the links go from up to down or vice versa 
 // 8. send an alert to the user about the link status through sms