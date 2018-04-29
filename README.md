# Trending Here 
[Video] (https://youtu.be/YSd5X2comws)

[URL] (https://trending-here.herokuapp.com/)
## by dreamTeam
# Members:
*  Henry Liu
*  Chandni Sehgal
*  Raph Alviz

# Description:
Trending Here is a web app that allows users to search and/or start a conversation topic with other users near them. Users can set a desired search radius for a trending topic and see available chats on that topic that are available. A user can also create a new chat room with certain topics for other users to join. Here are some user stories demonstrating the use of this app:
  >Bob has an exam for his web application course CSCC09 coming up later in the day. He is currently on campus and would like to find other students in the class who are also on campus so that he can discuss the course materials with them. He goes on the Trending Here website, logs in, sets his search radius for 1km, and searches for the topic 'CSCC09'. Immediately, he sees chats that have been started with the tag 'CSCC09' assigned as a search target. He sees a chat with the tags "CSCC09" and "exam", selects it, and asks for people who are available for discussion.

 >Alice is planning her first visit to a local event called the CNE. On the day of her plans, she hears about special pricing after 6 but could not find anything about it on the event page. She also wants to bring along snacks but does not know whether outside food is permitted. She decides that people in the city might know so she goes on Trending Here, sets the distance to cover the city, and searches for topic "CNE". She sees a result that includes "CNE" and "Q&A" as some of its tags. She selects the chat, asks her questions and was delighted to have someone who said they were a part of the event guest services immediately respond to her inquiries.


## Features and Functionality

**Features:**
*  Create chats with topic keywords assigned to the chat
*  Search chats with topic keywords
*  Limit the search radius
*  Join/Leave a chat

**A description of the technology used:**
* Backend
  - NodeJs and Express for our backend server
  - MongoDB to ensure consistency and high availability among all users
  - socket.io to allow a realtime reliable communication between users
  - React-hot-loader to load React components in real time without refreshing page
  - Sass loader to compile sass to css and integrate with React components

* Frontend
  - ReactJs will be used to allow dynamic graphic uploading, tag searching and other user components
  - Sockets to ensure reliable communication between client and server
  - Webpack to build React jsx to js
  - Browserify and Babel-hot-loader to allow realtime updates of React components


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
