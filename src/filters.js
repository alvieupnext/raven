import { dereference, setJSON, transformValue } from "./Utilities";
import { map, filter } from "rxjs"

function createFilterer(filterf) {
  return (observable) => {
    return observable
      .pipe(filter(data => filterf(data)))
  }
}

function sortGestures(values) {
  let index = 0;
  for (let valu of values) {
    let clone = dereference(valu)
    values[index] = setJSON(clone, 'gesture', setJSON(clone.gesture, 'gestures', clone.gesture.gestures.sort(compareFPGestures)))
    index++;
  }
  return values
}



function createSort(sortf) { //requires data to be an array
  return (observable) => {
    return observable
      // .pipe(tap(json => console.log(json.value)))
      .pipe(map(json => transformValue(json, sortf)))
    // .pipe(tap(json => console.log(json.value)))
  }
}

function compareFPGestures(a, b) { //get best feature first
  if (a.score === b.score) {
    return 0;
  }
  return a.score > b.score ? -1 : 1
}

function removeEmptyHand(json) {
  return json.value.multiHandWorldLandmarks.length !== 0
}

function removeNoGestures(json) {
  for (let gest of json.value) {
    if (gest.gesture !== "no_gesture") {
      return true
    }
  }
  return false
}

const SortByBestGesture = createSort(sortGestures)



const EmptyHandFilter = createFilterer(removeEmptyHand)

export { EmptyHandFilter, SortByBestGesture }
