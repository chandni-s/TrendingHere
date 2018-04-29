# Trending Here

## API Documentation

### Create

- description: Sign up
- request: `PUT /api/signup/`
    - content-type: `application/json`
    - body: object
      - username: (string) username of user
      - password: (string) password for their account
- response:
    - content-type: `application/json`
    - body: object
      - username: (string) username signed up
- response: 500
    - body: Database error
- response: 409
    - body: Username already exists


```
curl -k -X PUT -H "Content-Type: application/json" -d '{"username":"alice","pass":"1"}' --cookie-jar ./cookieFile http://localhost:3000/api/signup/
```

- description: Sign In
- request: `POST /api/signin/`
  - content-type: `application/json`
  - body: object
    - username: (string) username for this account
    - password: (string) password used to sign up for this account
- response:
    - content-type: `application/json`
    - body: object
      - data: (boolean) whether the user was successful in signing in or not

- response: 400
    - body: User not found
- response: 500
    - body: Database error
- response: 401
    - body: Unauthorized


```
curl -b -k -X POST -H "Content-Type: application/json" -d '{"username":"alice","pass":"1"}' --cookie-jar cookieFile http://localhost:3000/api/signin/
```

- description: Add a trend
- request: `POST /api/addtrend/`
    - content-type: `application/json`
    - body: object
      - tagname: (string) the tag of trend that the user wants to add
- response: 200
    - content-type: `application/json`
    - body: Tag save success (string) a message if tag is successfully saved into db

- response: 403
    - body: Forbidden
- response: 500
    - body: Database error

```
curl -k -X POST -H "Content-Type: application/json" -d '{ "name": "cscc09", "username": "alice" }' --cookie ./cookieFile http://localhost:3000/api/addtrend/
```

- description: Create a new chat for a trend
- request: `POST /api/chat/`
  - content-type: `application/JSON`
  - body: object
    - chatname: (string) the name of chat that user wants to start
    - description: (string) a description for the chat
    - tags: (string) list of tags that user wants this chat to associate with
    - long: (string) fetched automatically based on location the user has logged in from
    - lat: (string) fetched automatically based on location the user has logged in from
    - username: (string) fetched from user's login session

- response: 200
  - content-type: `application/json`
  - body: object
    - username: (string) username of user who started the chat
    - chatname: (string) name of this chat created
    - _id: (string) id of this chat created
    - date: (Date) the date of this chat created
    - tags: (string) list of tags associated with this chat
    - description: (string) the description of this chat

- response:400
  - body: Chat name already exists. Please choose a new name
- response: 403
    - body: Forbidden
- response: 500
    - body: Database error

```
$ curl -k -X POST -H "Content-Type: application/json" -d '{"chatname":"cscc09","tags":"cscc09", "description":"a chat for cscc09 final exam"}' --cookie ./cookieFile http://localhost:3000/api/chat/
```

### Read

- description: sign the user out of Trending Here and destroy their current session
- request: `GET /api/signout/`
- response:
- response: 500
    -body: Database error

```
curl -k -X GET --cookie ./cookieFile http://localhost:3000/api/signout/
```

- description: search for a tag in the application
- request: `GET /api/trends/search/:tagname/`
- response: 200
  - content-type: `application/json`
  - body: list of objects
    - tagname: (string) name of the tag that is being searched for
    - long: (string) longitude of tag where it was created at
    - lat: (string) latitude of tag where it was created at
    - username: (string) name of the user who created that tag
    - date: (Date) date when the tag was created
    - _id: (string) id of the tag searched

- response: 403
    - body: Forbidden
- response: 404
    - body: Tag not found

```
$ curl -k -X GET --cookie ./cookieFile http://localhost:3000/api/trends/search/cscc09/
```

- description: get recent 10 tags from the database when user signs-in
- request: `GET /api/tags/`
- response: 200
  - content-type: `application/json`
  - body: list of objects
    - username: (string) the user who created this tag
    - tagname: (string) name of the tag
    - date: (string) the date on which this tag was generated
    - long: (string) the longitude of location at which this tag was created
    - lat: (string) the latitude of location at which this tag was created
    - _id: (string) the id of this tag object

- response: 403
    - body: Forbidden
- response: 500
    - body: Database error

```
curl -k -X GET --cookie ./cookieFile http://localhost:3000/api/tags/
```

- description: get a chat for a trend searched by user, based on location of user within 50km radius to where the chat was created
- request: `GET /api/chats/search/nearby/:trend/`
- response: 200
  - content-type: `application/json`
  - body: list of objects
    - username: (string) name of the user who created this chat
    - tags: (List of string) list of tags associated with this chat
    - chatname: (string) name of the chat found for the trend searched by user
    - long: (string) longitude of chat where it is originally created
    - lat: (string) latitude of chat where it is originally created
    - description: (string) description of this chat

- response: 403
  - body: Forbidden
- response: 500

```
curl -k -X GET --cookie ./cookieFile http://localhost:3000/api/chats/search/nearby/cscc09/
```

- description: Get chats for the trend selected by user
- request: `GET /api/search/trend/:trend`
- response: 200
  - content-type: `application/json`
  - body: list of objects
    - username: (string) name of the user who created this chat
    - tags: (List of string) list of tags associated with this chat
    - chatname: (string) name of the chat found for the trend searched by user
    - long: (string) longitude of chat where it is originally created
    - lat: (string) latitude of chat where it is originally created
    - description: (string) description of this chat

```
curl -k -X GET --cookie ./cookieFile http://localhost:3000/api/search/trend/cscc09
```
