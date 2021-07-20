# chat-app

Chat app is an app for mobile devices built with React Native and developed using Expo.

The chat interface functionality is created with the Gifted Chat library. Chat conversations are stored locally with Google Firestore Database and Google Firebase authentication and are also accessible offline.

Users are able to share images (take a picture or choose from media library) once the user grants access to their local media library and camera. Location sharing is enabled by the user granting the app permission to read user location data.

## Install dependencies

Check if you are running the latest version of Node.

Install Expo and create [your-Expo-account] (https://expo.io/signup)

`$ npm install expo-cli --global`

Set up your React Native App in your projects folder

`$ expo init hello-world`

Go to your project's directory

`$ cd hello-world`

Launch the https server Metro Bundler in a new tab

`$ npm run start`

or

`$ expo start`

## Mobile Device Setup

Install the Expo app through your device's app store (iOS or Android)

Login with expo account

Take a screenshot of the QR Code on the Metro Builder

## Device Emulator Setup

If you would like to run the app on your machine through a simulator/emulator, you will either need

-Android Studio

-iOS Simulator

## Features

Home page where users can enter their name and choose a background color for the chat screen

Conversation page displaying the conversation

Users can send images and location data

Datastorage online in firebase Cloud and local storage offline

## Technologies

React Native

Expo

Google Firestore Database

Gifted Chat library
