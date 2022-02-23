import {Finger, FingerCurl, FingerDirection, GestureDescription} from 'fingerpose'

const thumbsUp = new GestureDescription('thumbs_up');

//until i find a way to rotate HTMLVideoElement, i will just flip the thumbs

// thumb:
// - curl: none (must)
// - direction vertical up (best)
// - direction diagonal up left / right (acceptable)
thumbsUp.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
thumbsUp.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 1.0);
thumbsUp.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.7);
thumbsUp.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.7);

// all other fingers:
// - curled (best)
// - half curled (acceptable)
// - pointing down is NOT acceptable
for(let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  thumbsUp.addCurl(finger, FingerCurl.FullCurl, 1.0);
  thumbsUp.addCurl(finger, FingerCurl.HalfCurl, 0.9);
  thumbsUp.addDirection(finger, FingerDirection.HorizontalLeft, 1);
  thumbsUp.addDirection(finger, FingerDirection.HorizontalRight, 1);
  thumbsUp.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.5);
  thumbsUp.addDirection(finger, FingerDirection.DiagonalUpRight, 0.5);
}

// require the index finger to be somewhat left or right pointing
// but NOT down and NOT fully up
// thumbsUp.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 0.5);
// thumbsUp.addDirection(Finger.Index, FingerDirection.HorizontalLeft, 1);
// thumbsUp.addDirection(Finger.Index, FingerDirection.HorizontalRight, 1);
// thumbsUp.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 0.4);


const okaySign = new GestureDescription("okay")

okaySign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0)
okaySign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.9)
okaySign.addCurl(Finger.Index, FingerCurl.HalfCurl, 1.0)
okaySign.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0)
okaySign.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0)
okaySign.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0)

for(let finger of [Finger.Middle, Finger.Ring, Finger.Pinky]) {
    okaySign.addDirection(finger, FingerDirection.VerticalUp, 0.8);
    okaySign.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.7);
    okaySign.addDirection(finger, FingerDirection.DiagonalUpRight, 0.7);
}

const thumbsDown = new GestureDescription('thumbs_down');

// thumb:
// - curl: none (must)
// - direction vertical up (best)
// - direction diagonal up left / right (acceptable)
thumbsDown.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
thumbsDown.addDirection(Finger.Thumb, FingerDirection.VerticalDown, 1.0);
thumbsDown.addDirection(Finger.Thumb, FingerDirection.DiagonalDownLeft, 0.7);
thumbsDown.addDirection(Finger.Thumb, FingerDirection.DiagonalDownRight, 0.7);
// thumbsDown.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 0.8);

// all other fingers:
// - curled (best)
// - half curled (acceptable)
// - pointing down is NOT acceptable
for(let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    thumbsDown.addCurl(finger, FingerCurl.FullCurl, 1.0);
    thumbsDown.addCurl(finger, FingerCurl.HalfCurl, 0.9);
    thumbsDown.addDirection(finger, FingerDirection.HorizontalLeft, 1);
    thumbsDown.addDirection(finger, FingerDirection.HorizontalRight, 1);
    thumbsDown.addDirection(finger, FingerDirection.DiagonalDownLeft, 0.5);
    thumbsDown.addDirection(finger, FingerDirection.DiagonalDownRight, 0.5);
}

// require the index finger to be somewhat left or right pointing
// but NOT down and NOT fully up


const thumbsRight = new GestureDescription('thumbs_left');

// thumb:
// - curl: none (must)
// - direction vertical up (best)
// - direction diagonal up left / right (acceptable)
thumbsRight.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
// thumbsRight.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 0.7);
thumbsRight.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 1.0);
thumbsRight.addDirection(Finger.Thumb, FingerDirection.DiagonalDownRight, 1.0);
thumbsRight.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 1.0);

// all other fingers:
// - curled (best)
// - half curled (acceptable)
// - pointing down is NOT acceptable
for(let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    thumbsRight.addCurl(finger, FingerCurl.FullCurl, 1.0);
    thumbsRight.addCurl(finger, FingerCurl.HalfCurl, 0.9);
}

for(let finger of [Finger.Middle, Finger.Ring]) {
    thumbsRight.addDirection(finger, FingerDirection.VerticalDown, 1);
    thumbsRight.addDirection(finger, FingerDirection.VerticalUp, 1);
    thumbsRight.addDirection(finger, FingerDirection.DiagonalDownRight, 0.9);
    thumbsRight.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.9);
}

for(let finger of [Finger.Index, Finger.Pinky]) {
    thumbsRight.addDirection(finger, FingerDirection.DiagonalDownRight, 1);
    thumbsRight.addDirection(finger, FingerDirection.DiagonalUpLeft, 1);
    thumbsRight.addDirection(finger, FingerDirection.VerticalDown, 0.9);
    thumbsRight.addDirection(finger, FingerDirection.VerticalUp, 0.9);
}

// require the index finger to be somewhat left or right pointing
// but NOT down and NOT fully up
// thumbsRight.addDirection(Finger.Index, FingerDirection.DiagonalDownRight, 0.2);
// thumbsRight.addDirection(Finger.Index, FingerDirection.VerticalDown, 1);
// thumbsRight.addDirection(Finger.Index, FingerDirection.VerticalUp, 1);
// thumbsRight.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 0.2);

const thumbsLeft = new GestureDescription('thumbs_right'); //description needs to be flipped because the webcam feed is mirrored

thumbsLeft.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
// thumbsLeft.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 0.2);
thumbsLeft.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 1.0);
thumbsLeft.addDirection(Finger.Thumb, FingerDirection.DiagonalDownLeft, 1.0);
thumbsLeft.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 1.0);

// all other fingers:
// - curled (best)
// - half curled (acceptable)
// - pointing down is NOT acceptable
for(let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    thumbsLeft.addCurl(finger, FingerCurl.FullCurl, 1.0);
    thumbsLeft.addCurl(finger, FingerCurl.HalfCurl, 0.9);
}

for(let finger of [Finger.Middle, Finger.Ring]) {
    thumbsLeft.addDirection(finger, FingerDirection.VerticalDown, 1);
    thumbsLeft.addDirection(finger, FingerDirection.VerticalUp, 1);
    thumbsLeft.addDirection(finger, FingerDirection.DiagonalDownLeft, 0.9);
    thumbsLeft.addDirection(finger, FingerDirection.DiagonalUpRight, 0.9);
}

for(let finger of [Finger.Index, Finger.Pinky]) {

    thumbsLeft.addDirection(finger, FingerDirection.VerticalDown, 0.9);
    thumbsLeft.addDirection(finger, FingerDirection.VerticalUp, 0.9);
    thumbsLeft.addDirection(finger, FingerDirection.DiagonalDownLeft, 1);
    thumbsLeft.addDirection(finger, FingerDirection.DiagonalUpRight, 1);
}


const stopSign = new GestureDescription('stop')

for (let finger of Finger.all) {
    stopSign.addCurl(finger, FingerCurl.NoCurl, 1.0)
}
for(let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    stopSign.addDirection(finger, FingerDirection.VerticalUp, 1.0)
}

stopSign.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 1.0)
stopSign.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 1.0)


const highFive = new GestureDescription('high_five')

for (let finger of Finger.all){
    highFive.addCurl(finger, FingerCurl.NoCurl, 1.0)
}

for (let finger of [Finger.Middle, Finger.Ring]) {
    highFive.addDirection(finger, FingerDirection.VerticalUp, 1)
    highFive.addDirection(finger, FingerDirection.DiagonalUpRight, 0.7);
    highFive.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.7);
}

for (let finger of [Finger.Index, Finger.Pinky]) {
    highFive.addDirection(finger, FingerDirection.VerticalUp, 0.7)
    highFive.addDirection(finger, FingerDirection.DiagonalUpRight, 1);
    highFive.addDirection(finger, FingerDirection.DiagonalUpLeft, 1);
}

highFive.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 1)
highFive.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 1)


// highFive.addDirection(Finger.Middle, FingerDirection.VerticalUp, 1.0)
// highFive.addDirection(Finger.Middle, FingerDirection.DiagonalUpRight, 0.9);
// highFive.addDirection(Finger.Middle, FingerDirection.DiagonalUpLeft, 0.9);

// highFive.addDirection(Finger.Ring, FingerDirection.VerticalUp, 1.0)
// highFive.addDirection(Finger.Ring, FingerDirection.DiagonalUpRight, 0.9);
// highFive.addDirection(Finger.Ring, FingerDirection.DiagonalUpLeft, 0.9);

// highFive.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 1.0);
// highFive.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 1.0);
// highFive.addDirection(Finger.Index, FingerDirection.HorizontalRight,0.95);
// highFive.addDirection(Finger.Index, FingerDirection.HorizontalLeft, 0.95);

// highFive.addDirection(Finger.Pinky, FingerDirection.HorizontalRight,0.95);
// highFive.addDirection(Finger.Pinky, FingerDirection.HorizontalLeft, 0.95);
// highFive.addDirection(Finger.Pinky, FingerDirection.DiagonalUpRight, 1.0);
// highFive.addDirection(Finger.Pinky, FingerDirection.DiagonalUpLeft, 1.0);

// highFive.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 1.0);
// highFive.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 1.0);
// highFive.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 0.9);
// highFive.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 0.9);

const victory = new GestureDescription('victory');


// thumb:
victory.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 1.0);
victory.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 1.0);
victory.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 1.0);

// index:
victory.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
victory.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.5);
victory.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 0.9);
victory.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 0.9);
victory.addDirection(Finger.Index, FingerDirection.HorizontalLeft, 0.9);
victory.addDirection(Finger.Index, FingerDirection.HorizontalRight, 0.9);

// middle:
victory.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
victory.addDirection(Finger.Middle, FingerDirection.VerticalUp, 0.5);
victory.addDirection(Finger.Middle, FingerDirection.DiagonalUpLeft, 0.9);
victory.addDirection(Finger.Middle, FingerDirection.DiagonalUpRight, 0.9);
victory.addDirection(Finger.Middle, FingerDirection.HorizontalLeft, 0.9);
victory.addDirection(Finger.Middle, FingerDirection.HorizontalRight, 0.9);

// ring:
victory.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
victory.addCurl(Finger.Ring, FingerCurl.HalfCurl, 0.9);

// pinky:
victory.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
victory.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 0.9);

const hold = new GestureDescription('hold');

hold.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 1.0);
hold.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 1.0);
hold.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 1.0);

// index:
hold.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
hold.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);
hold.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 0.5);
hold.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 0.5);
hold.addDirection(Finger.Index, FingerDirection.HorizontalLeft, 0.9);
hold.addDirection(Finger.Index, FingerDirection.HorizontalRight, 0.9);

// middle:
hold.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
hold.addDirection(Finger.Middle, FingerDirection.VerticalUp, 1.0);
hold.addDirection(Finger.Middle, FingerDirection.DiagonalUpLeft, 0.3);
hold.addDirection(Finger.Middle, FingerDirection.DiagonalUpRight, 0.3);
hold.addDirection(Finger.Middle, FingerDirection.HorizontalLeft, 0.9);
hold.addDirection(Finger.Middle, FingerDirection.HorizontalRight, 0.9);

// ring:
hold.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
hold.addCurl(Finger.Ring, FingerCurl.HalfCurl, 0.9);

// pinky:
hold.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
hold.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 0.9);

const pointUp = new GestureDescription("one")

pointUp.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0)
pointUp.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0)
pointUp.addCurl(Finger.Middle, FingerCurl.HalfCurl, 0.9)
pointUp.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0)
pointUp.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 0.9);
pointUp.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0)
pointUp.addCurl(Finger.Ring, FingerCurl.HalfCurl, 0.9);

pointUp.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0)

pointUp.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 0.9)
pointUp.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 0.9)

pointUp.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.9)
pointUp.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 0.9)
pointUp.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.9)

pointUp.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.9)

const three = new GestureDescription("three")

three.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0)
three.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0)
three.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0)
three.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 1.0)
three.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0)
three.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0)
three.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0.9)

for (let finger of [Finger.Index, Finger.Ring]){
    
    three.addDirection(finger, FingerDirection.DiagonalUpLeft, 1)
    three.addDirection(finger, FingerDirection.DiagonalUpRight, 1)
}

three.addDirection(Finger.Middle, FingerDirection.VerticalUp, 1.0)

three.addDirection(Finger.Pinky, FingerDirection.VerticalDown, 1.0)

three.addDirection(Finger.Pinky, FingerDirection.DiagonalDownLeft, 0.9)
three.addDirection(Finger.Pinky, FingerDirection.DiagonalDownRight, 0.9)

three.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 1)
three.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 1)

const four = new GestureDescription('four')


for (let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]){
    four.addCurl(finger, FingerCurl.NoCurl, 1.0)
}

for (let finger of [Finger.Middle, Finger.Ring]) {
    four.addDirection(finger, FingerDirection.VerticalUp, 1)
    four.addDirection(finger, FingerDirection.DiagonalUpRight, 0.7);
    four.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.7);
}

for (let finger of [Finger.Index, Finger.Pinky]) {
    four.addDirection(finger, FingerDirection.VerticalUp, 0.7)
    four.addDirection(finger, FingerDirection.DiagonalUpRight, 1);
    four.addDirection(finger, FingerDirection.DiagonalUpLeft, 1);
}

four.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0)
four.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 1)
four.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 1)

const yeah = new GestureDescription('yeah')

yeah.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0)
yeah.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0)
yeah.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0)
yeah.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0)
yeah.addCurl(Finger.Middle, FingerCurl.HalfCurl, 0.9)
yeah.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0)
yeah.addCurl(Finger.Ring, FingerCurl.HalfCurl, 0.9)

yeah.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0)
yeah.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 1.0)
yeah.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 1.0)
yeah.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 1.0)
yeah.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.9)
yeah.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.9)

const phone = new GestureDescription('phone')

phone.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0)
phone.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0)
phone.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0)
phone.addCurl(Finger.Middle, FingerCurl.HalfCurl, 0.9)
phone.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0)
phone.addCurl(Finger.Ring, FingerCurl.HalfCurl, 0.9)
phone.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0)
phone.addCurl(Finger.Index, FingerCurl.HalfCurl, 0.9)

phone.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 1.0)
phone.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 1.0)
phone.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 1.0)
phone.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.9)
phone.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.9)



export {okaySign, thumbsDown, highFive, stopSign, thumbsRight, thumbsUp, thumbsLeft, victory, hold, pointUp, three, four, yeah, phone}