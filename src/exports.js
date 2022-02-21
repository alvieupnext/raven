import { map } from 'rxjs';
import { setJSON, dereference } from './Utilities'

function vanillaExport(observer) {
   return observer
}

function minimalExport(observer) {
   return observer
      .pipe(map(json => { delete json.origin; return json }))
}

function timestampExport(observer) {
   return observer
      .pipe(map(json => setJSON(json, 'timestamp', Date.now())))
}

function historyExport(observer) {
   function exportFunction(json) {
      let history = json.history
      if (history === undefined) {
         history = []
      }
      delete json.history
      let copy = dereference(json)

      history.push(copy)

      json['history'] = history;
      return json
   }
   return observer
      .pipe(map(exportFunction))
}

function totalDelayExport(observer) {
   function difference(json) {
      if (json.history === undefined) {
         return 0
      }
      else return json['timestamp'] - json['history'][0].timestamp
   }
   return observer
      .pipe(map(json => setJSON(json, 'totalDelay', difference(json))))
}


function delayExport(observer) {
   function difference(json) {
      if (json.history === undefined) {
         return 0
      }
      else {
         let lastIndex = json.history.length - 1
         return json['timestamp'] - json['history'][lastIndex].timestamp
      }
   }
   return observer
      .pipe(map(json => setJSON(json, 'delay', difference(json))))
}

function completeExport(observer) {
   return observer
      .pipe(timestampExport,
         delayExport,
         totalDelayExport,
         historyExport,
      )
}


// eslint-disable-next-line import/no-anonymous-default-export
export { vanillaExport, minimalExport, totalDelayExport, historyExport, timestampExport, delayExport, completeExport }