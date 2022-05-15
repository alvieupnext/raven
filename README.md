# Raven

Raven is a JavaScript library written in the Reactive Programming paradigm that converts user gestures from a webcam to commands for the drone. 

## Prerequisites
Before we can run this program, Node.js and ffmpeg must be installed. The live video stream will not work without ffmpeg.
##	Setup
Once we have our prerequisites, we can run the program. Clone the Raven  repository, open the folder where the cloned files are and run the following command to install dependencies:

### `npm install`

##Launching Raven
For booting up Raven, run the following command:

### `npm run dev`

Make sure you are connected to the Tello Drone’s wi-fi before you run this command. Keep in mind that your pc is disconnected from the internet while controlling the Tello drone. Upon running this command, a new window will open.

## Using Raven
###	Webcam 
<p align="center">
  <img src="https://user-images.githubusercontent.com/94294217/168469089-f9a6f6e3-8dda-4ba6-970a-a7f22bf06d20.png" />
  <p align="center"> Figure 1: Webcam Feed + Buttons </p>
</p>

The first thing you will see is a live webcam feed of yourself. Below this webcam feed, there are two buttons:
-	Load MediaPipe Model will pre-load the Machine Learning model for faster use when enabling Gesture Recognition
-	Start will enable Gesture Recognition. If the ML model was not pre-loaded, the user must wait up to 5 seconds for the model to load before gestures can be detected.
Once we enable Gesture Recognition, our interface changes.
 <p align="center">
  <img src="https://user-images.githubusercontent.com/94294217/168469436-108298e6-b872-45ad-be68-b3c70ade4e5a.png" />
  <p align="center"> Figure 2: Webcam Feed when GR enabled </p>
</p>
The welcoming message above the webcam describes what command you are doing, along with the hand and the certainty score. There are red dots indicating the location of the landmark positions connected via green lines to form an accurate representation of a hand. You can press stop to disable Gesture Recognition.
###	Drone Menu 
Below the webcam are the controls for the drone. The contents of this menu will change depending on the state of the drone. There are 3 states:
-	Pc is not connected to the drone
-	Drone is connected but not airborne
-	Drone is connected and airborne

<p align="center">
  <img src="https://user-images.githubusercontent.com/94294217/168469535-ebe3b849-b36c-4037-8745-3de4abeb9d4b.png" />
  <p align="center"> Figure 3: Drone menu when not connected to drone </p>
</p>
If the program starts not connected to a drone, it will show a battery level at 0 and no video feed.

 <p align="center">
  <img src="https://user-images.githubusercontent.com/94294217/168469559-a3fd1e74-3ad4-4d31-b436-e6d171566b1d.png" />
  <p align="center"> Figure 4: Drone menu when connected to a stationary drone </p>
</p>

If the program starts connected to a drone, you can see the battery level of the drone, along with a button to make the drone takeoff. You also see a history of previous commands send to the Tello drone and a live video feed of the webcam from the drone.
Once our drone has taken off, we are greeted to a new menu with new features:

 <p align="center">
  <img src="https://user-images.githubusercontent.com/94294217/168469590-467c7883-73da-42fa-90b5-1f5b5ae8795a.png" />
  <p align="center"> Figure 5: New drone menu features when connected to an airborne drone </p>
</p>
 
The program provides buttons for controlling the drone in cases of emergency (where the Gesture Recognition might fail) and the command status on the top left that blinks green if the command has been successfully executed or red if it hasn’t. You can also use the sliders to decide what distance a drone should do per command (between 20cm and 1m), how many degrees to rotate and how fast to make the propellers spin.
###	Features
The main feature of the Raven library is the ability to control the Tello drone using gestures from a webcam. This section will talk about all the different kinds of commands, alongside some miscellaneous features.
Commands can only be recognized when Gesture Recognition is enabled. 
####	Single Commands
When airborne, commands for maneuvering the drone become available. These include moving in a certain direction, rotating either clockwise or counterclockwise, performing a flip either forward, backward, left or right, stopping the drone in mid-air or even landing. These commands only perform one action per command. Some of these commands require both hands to be used.
 
 <p align="center">
  <img src="https://user-images.githubusercontent.com/94294217/168469624-681d8ebb-5934-4290-ad6e-eb88853676b8.png" />
  <p align="center"> Figure 6: Single commands for controlling the drone </p>
</p>

Aside from these commands, Raven also can recognize how many fingers are being held up, all the way up to 10. These numbers will be used for command sequences and presets. 

 <p align="center">
  <img src="https://user-images.githubusercontent.com/94294217/168469639-3019372e-7efd-47b9-ae8b-e5d512f499ad.png" />
  <p align="center"> Figure 7: Held fingers detection </p>
</p>

####	Sequence of Commands (Take-off)
The takeoff button isn’t the only way to make the drone take off: if you count down from 3 to 1 consecutively, you can make the drone launch into the air.
 
  <p align="center">
  <img src="https://user-images.githubusercontent.com/94294217/168469667-556a4ab8-c071-4564-9773-e79428c2f716.png" />
  <p align="center"> Figure 8: Take-off sequence </p>
</p>

####	Motion Gestures
Aside from static gestures that get recognized every second, you can also perform a motion. These ones require performing a gesture and switching to another gesture within the same second. Raven supports 4 motion gestures:
-	Thumbs-Up to Thumbs-Left: Flip to Left
-	Thumbs-Up to Thumbs-Right: Flip to Right
-	Thumbs-Up to Thumbs-Down: Backflip
-	Thumbs-Down to Thumbs-Up: Front flip

####	Command Sequences
Aside from sending single commands, an user can also send a sequence of commands. Raven supports up to 10 sequences. The commands of a sequence are defined on server/presets.js
Once defined, an user can send these presets to the drone. Before doing that, the user has to enable sequences which can be done performing a special gesture. This gesture can also disable sequences.

  <p align="center">
  <img src="https://user-images.githubusercontent.com/94294217/168469771-4ee193cf-cfcd-4b3a-bd1e-1042a65c65ff.png" />
  <p align="center"> Figure 9: The gesture required for toggling sequences </p>
</p>
 
Once the sequences are enabled, you can choose a sequence from 1 to 10 by holding up the right amount of fingers (2 fingers = Sequence 2) 
Enabling sequences will enable safe mode by default (more on safe mode in next subsection)

####	Safe Mode
By default, commands will be queued and sent when the current command has finished. This allows you to gesture a sequence of moves, even while the drone is busy with a command. A by-product of this is that every single gesture gets turned into a command. This can lead to duplicate commands and commands performed by mistake. You can solve these issues by enabling safe mode.
 
<p align="center">
  <img src="https://user-images.githubusercontent.com/94294217/168469824-1c6790eb-2794-4c84-b2ed-e92ca4dfc8ad.png" />
  <p align="center"> Figure 10: Safe Mode </p>
</p>

Safe mode can be enabled/disabled using the blue button. When enabled, Raven will wait until a command has completed before performing another one. You can check whether the drone can receive another command by checking the bottom right of the menu.

####	Customization 
The provided settings will deliver the best experience for using Raven but these default settings of Raven can be changed in client/settings.js. Here you can tweak things like the refresh rate of the webcam, the interval for detecting a gesture or the mapping from gesture to drone command.
Aside from the default gestures, you can also define custom gestures by creating a new gesture in client/gestures.js. Keep in mind that any new gesture may interfere with already defined gestures. Examples of how to create gestures can be found in the same file. Don’t forget to add the newly defined gesture to the Gesture Estimator object (in client/streams.js)



## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
