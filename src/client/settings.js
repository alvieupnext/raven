//These are the customizable settings of Raven. You can change a lot of constants here to match your preferences
//Refresh Rate
const refreshRate = 60

//Max number of recognizable hands (min 2 hands)
const MAX_HANDS = 2

//Gesture confidence (by default 8)
const GESTURE_CONFIDENCE = 8

//Gesture mapping to commands
//one-handed commands
const one_hand = {
    thumbs_up: 'up',
    thumbs_right: 'right',
    thumbs_left: 'left',
    thumbs_down: 'down',
    stop: 'stop',
    yeah: 'forward',
    phone: 'back',
    emperor: 'sequenceToggle',
    one: 1,
    victory: 2,
    three: 3,
    four: 4,
    high_five: 5,
  }
  
  //commands for two hands
  const two_hand = {
    thumbs_up: 'secondary',
    thumbs_right: 'right',
    thumbs_left: 'left',
    thumbs_down: 'down',
    stop: 'land',
    yeah: 'forward',
    phone: 'back',
    emperor: 'sequenceToggle',
    one: 1,
    victory: 2,
    three: 3,
    four: 4,
    high_five: 5,
  }
  
  const two_hand_alt = {
    thumbs_up: 'yawCCW',
    thumbs_down: 'yawCW',
    thumbs_left: 'flip_l',
    thumbs_right: 'flip_r',
    yeah: 'flip_f',
    phone: 'flip_b',
    stop: 'land',
    emperor: 'sequenceToggle',
    one: 1,
    victory: 2,
    three: 3,
    four: 4,
    high_five: 5,
  }

export {one_hand, two_hand, two_hand_alt, refreshRate, MAX_HANDS, GESTURE_CONFIDENCE}