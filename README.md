# Notebook-Web-App

## Overview
- Description: This is a full-stack project of a web application for note taking and task managing
- Database: MongoDB
- Packages: see [package.json](package.json)
- *the project is not deployed, to test it out, you need to connect to your own MongoDB database and setup your own secret .env file*
- Quick Navigation:
  - [Frontend features](#Frontend)
  - [Backend APIs](#Backend)



## Frontend features <a id="Frontend"></a>
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



## Backend APIs <a id="Backend"></a>


### Login
*You may find the auth route implementations in [auth.js](controllers/auth.js) and User model in [User.js](models/User.js)*  
<div style="background-color: 999999;">

```
Route: /api/v1/login
```
</div>

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
*You may find the auth route implementations in [auth.js](controllers/auth.js) and User model in [User.js](models/User.js)*  
<div style="background-color: 999999;">

```
Route: /api/v1/register
```
</div>

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
*You may find the note route implementations in [notes.js](controllers/notes.js) and Task model in [Note.js](models/Note.js)*  
<div style="background-color: 999999;">

```
Route: /api/v1/notes
```
</div>

<table>
<thead>
    <tr><th>Method</th><th>Description</th><th>Sample Request</th><th>Sample Response</th></tr>
</thead>
<tbody>
<tr>
<td>GET</td>
<td>Route for getting all user's notes, authorization header with Bearer Token is required, response is all notes matched stored in an object array in JSON format</td>
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
<td>Route for creating new notes, authorization header with Bearer Token is required, title must be provided to fit the backend model, content, createdAt and comments are also optoins to pass in for update, response is the created note in JSON format</td>
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
    "notes": {
        "_id": "Document Id",
        "title": "Note title",
        "content": "Note content",
        "comments": " Note comments",
        "createdBy": "Note owner Id",
        "createdAt": "First create Timestamp",
        "updatedAt": "Last update timestamp",
        "__v": 0
    }
}
```
</td>
</tr>
</tbody>
</table>

<div style="background-color: 999999;">

```
Route: /api/v1/notes/:id
```
</div>
<table>
<thead>
    <tr><th>Method</th><th>Description</th><th>Sample Request</th><th>Sample Response</th></tr>
</thead>
<tbody>
<tr>
<td>GET</td>
<td>Route for getting one single note of the user, authorization header with Bearer Token is required, response is the note matched in JSON format</td>
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
    "notes": {
        "_id": "Document Id",
        "title": "Note title",
        "content": "Note content",
        "comments": " Note comments",
        "createdBy": "Note owner Id",
        "createdAt": "First create Timestamp",
        "updatedAt": "Last update timestamp",
        "__v": 0
    }
}
```
</td>
</tr>
<tr>
<td>PATCH</td>
<td>Route for updating one exsisting note of the user, authorization header with Bearer Token is required, request body same as note creating api (POST route), title must be provided to fit the backend model, content and comments are also options to pass in for update, createdAt will be updated if passed in but not suggested, response is the updated note in JSON format</td>
<td>

```json
{
    "title": "Note title",
    "content": "Note content",
    "comments": " Note comments",
}, {
    "headers": { "Authorization": "Bearer Token" }
}
```
</td>
<td>

```json
{ 
    "notes": {
        "_id": "Document Id",
        "title": "Note title",
        "content": "Note content",
        "comments": " Note comments",
        "createdBy": "Note owner Id",
        "createdAt": "First create Timestamp",
        "updatedAt": "Last update timestamp",
        "__v": 0
    }
}
```
</td>
</tr>
<tr>
<td>DELETE</td>
<td>Route for deleting one exsisting note of the user, authorization header with Bearer Token is required, response is the deleted note in JSON format</td>
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
    "notes": {
        "_id": "Document Id",
        "title": "Note title",
        "content": "Note content",
        "comments": " Note comments",
        "createdBy": "Note owner Id",
        "createdAt": "First create Timestamp",
        "updatedAt": "Last update timestamp",
        "__v": 0
    }
}
```
</td>
</tr>
</tbody>
</table>


### Task
*You may find the task route implementations in [tasks.js](controllers/tasks.js) and Task model in [Task.js](models/Task.js)*
<div style="background-color: 999999;">

```
Route: /api/v1/tasks/?parameter=value
```
</div>
<table>
<thead>
    <tr><th>Method</th><th>Description</th><th>Sample Request</th><th>Sample Response</th></tr>
</thead>
<tbody>
<tr>
<td>GET</td>
<td>Route for getting all user's tasks, query string parameters chaining using &, authorization header with Bearer Token is required, response is all tasks matched stored in an object array in JSON format</td>
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
    "tasks": [
        {
            "_id": "Document Id",
            "name": "Task name",
            "deadline": "Task deadline",
            "importance": 5,
            "completed": false,
            "createdBy": "Task owner Id",
            "createdAt": "First create Timestamp",
            "updatedAt": "Last update timestamp",
            "__v": 0
        }
    ], 
    "nbHits": "number of tasks matched"
}
```
</td>
</tr>
</tbody>
</table>

<table>
<thead>
    <tr><th>Description</th><th>Parameters</th><th>Field Name</th><th>Sample Query</th>
</thead>
<tbody>
<tr>
    <td rowspan="2">sorting tasks according to value passed in, multiple values should be seperated by commas</td>
    <td rowspan="2">sort=</td>
    <td>importance</td>
    <td rowspan="2">sort=importance,createdAt</td>
</tr>
<tr>
    <td>createdAt</td>
</tr>
</tbody>
</table>

<table>
<thead>
    <tr><th>Description</th><th>Parameters</th><th>Field Name</th><th>Operator</th><th>Values</th><th>Sample Query</th>
</thead>
<tbody>
    <tr>
        <td rowspan="5">filtering according to number of stars a task have (importance), multiple values should be seperated by commas</td>
        <td rowspan="7">filter=</td>
        <td rowspan="5">importance</td>
        <td>&gt;</td>
        <td rowspan="5">0-5: integer, representing number of stars a task have</td>
        <td rowspan="7">filter=importance>3,completed=0</td>
    </tr>
    <tr><td>&ge;</td></tr>
    <tr><td>=</td></tr>
    <tr><td>&lt;</td></tr>
    <tr><td>&le;</td></tr>
    <tr>
        <td rowspan="2">filtering according to wether a task is completed</td>
        <td rowspan="2">completed</td>
        <td rowspan="2">=</td>
        <td>0: task is not completed</td>
    </tr>
    <tr><td>1: task is completed</td></tr>
</tbody>
</table>

<div style="background-color: 999999;">

```
Route: /api/v1/tasks/
```
</div>
<table>
<thead>
    <tr><th>Method</th><th>Description</th><th>Sample Request</th><th>Sample Response</th></tr>
</thead>
<tbody>
<tr>
<td>POST</td>
<td>Route for creating new task, authorization header with Bearer Token is required, name is required in request body, deadline, importance, and completed are also options to be passed in, response is the created task in JSON format</td>
<td>

```json
{
    "name": "Task name",
    "deadline": "Task deadline",
    "importance": 0,
    "completed": true,
}, {
    "headers": { "Authorization": "Bearer Token" }
}
```
</td>
<td>

```json
{ 
    "tasks": {
        "_id": "Document Id",
        "name": "Task name",
        "deadline": "Task deadline",
        "importance": 0,
        "completed": true,
        "createdBy": "Task owner Id",
        "createdAt": "First create Timestamp",
        "updatedAt": "Last update timestamp",
        "__v": 0
    }
}
```
</td>
</tr>
</tbody>
</table>


<div style="background-color: 999999;">

```
Route: /api/v1/tasks/:id
```
</div>
<table>
<thead>
    <tr><th>Method</th><th>Description</th><th>Sample Request</th><th>Sample Response</th></tr>
</thead>
<tbody>
<tr>
<td>GET</td>
<td>Route for getting one single task of the user, authorization header with Bearer Token is required, response is the task matched in JSON format</td>
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
    "tasks": {
        "_id": "Document Id",
        "name": "Task name",
        "deadline": "Task deadline",
        "importance": 3,
        "completed": false,
        "createdBy": "Task owner Id",
        "createdAt": "First create Timestamp",
        "updatedAt": "Last update timestamp",
        "__v": 0
    }
}
```
</td>
</tr>
<tr>
<td>PATCH</td>
<td>Route for updating task of the user, authorization header with Bearer Token is required, request body similar to the creating api (POST route), name is required in request body, deadline, importance, and completed are also options to be passed in, createdAt will be updated if passed in but not suggested, response is the task matched in JSON format</td>
<td>

```json
{
    "name": "Task name",
    "deadline": "Task deadline",
    "importance": 0,
    "completed": true,
}, {
    "headers": { "Authorization": "Bearer Token" }
}
```
</td>
<td>

```json
{ 
    "tasks": {
        "_id": "Document Id",
        "name": "Task name",
        "deadline": "Task deadline",
        "importance": 0,
        "completed": true,
        "createdBy": "Task owner Id",
        "createdAt": "First create Timestamp",
        "updatedAt": "Last update timestamp",
        "__v": 0
    }
}
```
</td>
</tr>
<tr>
<td>DELETE</td>
<td>Route for deleting and existing task of the user, authorization header with Bearer Token is required, response is the task deleted in JSON format</td>
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
    "tasks": {
        "_id": "Document Id",
        "name": "Task name",
        "deadline": "Task deadline",
        "importance": 3,
        "completed": false,
        "createdBy": "Task owner Id",
        "createdAt": "First create Timestamp",
        "updatedAt": "Last update timestamp",
        "__v": 0
    }
}
```
</td>
</tr>
</tbody>
</table>
