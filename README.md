# RPS Conference App code 

## NOTE: If you are using version 2.5.0 of NativeScript CLI, there is currently an issue with it not copying all required files. Here's how to fix it...

To solve the problem, use the @next version which has the problem fixed and use the branch called ```update_2.5.0``` of this repository. Make sure you have an up to date version of Node as well. 

To install the @next version of the NativeScript CLI on Windows:
```
npm install nativescript@next -g
```

To install the @next version of the NativeScript CLI on a Mac:
```
sudo npm install nativescript@next -g
```

Clone this repository
```
git clone https://github.com/alexziskind1/courses-rps-conference-app.git
```

Go into the repository directory
```
cd courses-rps-conference-app
```

Change to the ```update_2.5.0``` branch
```
git checkout update_2.5.0
```

Go into the project directory
```
cd rps-conf
```

Run the project on iOS
```
tns run ios
```

Run the project on Android (I start up my Genymotion emulator before this step)
```
tns run android
```

---------------

This is a companion app to my Pluralsight course Building Cross Platform Native Mobile Applications with NativeScript.
This app is based on the [TelerikNEXT app](https://github.com/NativeScript/sample-TelerikNEXT/) sample with a few things added.

Fork/clone the repository and run ```npm install``` in the rps-conf directory. 
This app is based on the Telerik NEXT app sample with a few things added.

Use this application to find-out how to implement common mobile scenarios with NativeScript.

## Running the sample

1. Make sure you have the [NativeScript Command Line Interface](https://www.npmjs.com/package/nativescript) installed as well as all the prerequisites for the NativeScript development.

2. Fork and/or clone the repo:
  ```
  git clone https://github.com/alexziskind1/courses-rps-conference-app.git
  cd courses-rps-conference-app/rps-conf
  ```
3. Install the dependencies
  ```
  npm install
  ```

4. Run the project:

    `tns run ios|android [--emulator]`

    The `--emulator` keyword instructs the CLI to load the iOS simulator or an android emulator depending on the platform you want.

