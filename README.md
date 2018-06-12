# Repo for the smava challenge

This repo contains all the functional tests defined by the Author to complete the challenge of the `recrt`
API.

## Commands

Simply run in your maven project:

```zsh
mvn tomcat7:run
```

And then you can call the functional tests

```zsh
npm test
```

Output example:

```zsh
  Testing the smava endpoints in the local environment
    /rest/users endpoints
      # GET /rest/users
        ✓ Should get the users with the admin role (49ms)
      # GET /rest/users/{username}/accounts
        ✓ Should get the accounts from user2 with the admin role (50ms)
        ✓ Should get the accounts from user2 with the user role. Not allowed
    /rest/accounts endpoints
      # GET /rest/accounts
        ✓ Should get the bank account of the user2 (53ms)
        ✓ Should get the zero bank accounts of the user3
        ✓ Should get a 401 for the admin user
      # POST /rest/accounts
        ✓ Should create an account with the admin user for the user3 (99ms)


  7 passing (487ms)
```