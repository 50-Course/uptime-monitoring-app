# Downtime Montoring Application
![Server Monitoring App Image](https://www.atatus.com/images/home/performance-monitoring.svg)

#### _Project-based learning approach to introduce myself to core Node.js, zero libraries (only built-in Node modules), No NPM._

## About the Project
Uptime Monitoring Application, this is a web app built on core Node.js to monitor server/resource uptimes and downtimes.
The application allows user to check if a resource is available on a server by entering the url, it then notifies the user via Mobile Text shoudld a previously available resource gets taken down from a server (and vice-versa).
Project Name: goCloud

## Features
    - Upto 3 Checks for non-registered users
    - Unlimited number of checks + Uptime Notification, only for registered users

## Service Structure
    * Users
    * Checks
    * Validation Tokens
    * Twillio Integration for Text Notification System
    * Custom Mail Notification System

## Requirement Specs - Backend
    - [ ] API should listen on a port, accept HTTP requests for POST, GET, DELETE, PUT and HEAD Methods.
    - [ ] Possibly, api should feature HTTPS Support for Deployment
    - [ ] API should allow client to create a new user, modify its profile and delete the user
    - [ ] The API should allow non-registered users to perform limited number of request checks
    - [ ] Registered users, should go securely upto 5 checks, with token-authenticated requests
    - [ ] API should invalidate users tokens at sign out
    - [ ] Users should be able to delete or modify any of their checks
    - [ ] In the background, application workers' should perform checks periodically and notify the users via  preffered channels

## Notes
    - Written in Vanilla JS; _may score unstable code patterns, such as snake-cases, arrow functions in some areas, etc_
    - Why did i pick this project for a start? the complexity should get me fairly along with Javasript and introduce me to core Node.js, while making the learning journey fun
    - Timed deadline 10 days for project completion - _this is proposed, not definite_