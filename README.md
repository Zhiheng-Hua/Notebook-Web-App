# Notebook-Web-App

## Overview
- Description: a web application for note taking and task managing
- Database: MongoDB
- Packages: see [package.json](package.json)
- *the project is not deployed, to test it out, you need to connect to your own MongoDB database and setup your own secret .env file*



## Frontend features
### Authorization
Register
<div><img src="demo-files\register-demo.gif" width=70%></div>
Login / Logout
<div><img src="demo-files\login-logout-demo.gif" width=70%></div>

### Note
Adding Notes
<div><img src="demo-files\add-note-demo.gif" width=70%></div>
Showing Note Details
<div><img src="demo-files\expand-note-demo.gif" width=70%></div>
Updating Notes
<div><img src="demo-files\update-note-demo.gif" width=70%></div>
Deleting Notes
<div><img src="demo-files\delete-note-demo.gif" width=70%></div>

### Task
Adding Tasks
<div><img src="demo-files\add-tasks-demo.gif" width=70%></div>
Sorting & Filtering Tasks
<div><img src="demo-files\customize-tasks-demo.gif" width=70%></div>
Updating Tasks
<div><img src="demo-files\update-tasks-demo.gif" width=70%></div>
Deleting Tasks
<div><img src="demo-files\delete-tasks-demo.gif" width=70%></div>

### Navigation
<div><img src="demo-files\navigation-demo.gif" width=70%></div>



## Backend APIs


### Login
*You may find the auth route implementations in [auth.js](controllers\auth.js) and User model in [User.js](models\User.js)*  
```
Route: /api/v1/login
```
<table>
<thead>
    <tr><th>Method</th><th>Description</th><th>Sample Request</th><th>Sample Response</th></tr>
</thead>
<tbody>
<tr>
<td>POST</td>
<td>Route for user to login, email and password are required in the request body, response in JSON format</td>
<td>

```json
{
    "email": "user@gmail.com",
    "password": "passowrd"
}
```
</td>
<td>

```json
{
    "user": { 
        "name": "username when register"
    }, 
    "token": "authentication token"
}
```
</td>
</tr>
</tbody>
</table>

### Register
*You may find the auth route implementations in [auth.js](controllers\auth.js) and User model in [User.js](models\User.js)*  
```
Route: /api/v1/register
```

<table>
<thead>
    <tr><th>Method</th><th>Description</th><th>Sample Request</th><th>Sample Response</th></tr>
</thead>
<tbody>
<tr>
<td>POST</td>
<td>Route for user to register, username, email and password are required in the request body, response in JSON format</td>
<td>

```json
{
    "name": "username to use",
    "email": "email to use",
    "password": "password to use"
}
```
</td>
<td>

```json
{
    "user": { 
        "name": "user name when register"
    }, 
    "token": "authentication token"
}
```
</td>
</tr>
</tbody>
</table>


### Note
*You may find the note route implementations in [notes.js](controllers\notes.js) and Task model in [Note.js](models\Note.js)*  
```
Route: /api/v1/notes
```

<table>
<thead>
    <tr><th>Method</th><th>Description</th><th>Sample Request</th><th>Sample Response</th></tr>
</thead>
<tbody>
<tr>
<td>GET</td>
<td>Route for getting all notes one specific user stored in database, authorization header with Bearer Token is required, response in JSON format</td>
<td>

```json
{
    "headers": { "Authorization": "Bearer Token" }
}
```
</td>
<td>

```json
{ 
    "notes": [
        {
            "_id": "Document Id",
            "title": "Note title",
            "content": "Note content",
            "comments": " Note comments",
            "createdBy": "Note owner Id",
            "createdAt": "First create Timestamp",
            "updatedAt": "Last update timestamp",
            "__v": 0
        }
    ], 
    "nbHits": "number of notes matched"
}
```
</td>
</tr>
<tr>
<td>POST</td>
<td>Route for creating new notes, authorization header with Bearer Token is required, title is required in request body to meet model creation need response in JSON format</td>
<td>

```json
{
    "title": "Note title",
    "content": "Note content",
    "createdAt": "First create Timestamp",
    "comments": " Note comments",
}, {
    "headers": { "Authorization": "Bearer Token" }
}
```
</td>
<td>

```json
{ 
    "notes": [
        {
            "_id": "Document Id",
            "title": "Note title",
            "content": "Note content",
            "comments": " Note comments",
            "createdBy": "Note owner Id",
            "createdAt": "First create Timestamp",
            "updatedAt": "Last update timestamp",
            "__v": 0
        }
    ]
}
```
</td>
</tr>

</tbody>
</table>

```
Route: /api/v1/notes/:id
```
// TODO


### Task
*You may find the task route implementations in [tasks.js](controllers\tasks.js) and Task model in [Task.js](models\Task.js)*

// TODO