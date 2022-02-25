import { map } from 'rxjs';
import { setJSON, dereference } from './Utilities'

var exporter = vanillaExport

function setExporter(newExport){
   exporter = newExport
}

function getExporter(){
   return exporter
}

function vanillaExport(observable) {
   return observable
}

function minimalExport(observable) {
   return observable
      .pipe(map(json => { delete json.origin; return json }))
}

function timestampExport(observable) {
   return observable
      .pipe(map(json => setJSON(json, 'timestamp', Date.now())))
}

function historyExport(observable) {
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
   return observable
      .pipe(map(exportFunction))
}

function totalDelayExport(observable) {
   function difference(json) {
      if (json.history === undefined) {
         return 0
      }
      else return json['timestamp'] - json['history'][0].timestamp
   }
   return observable
      .pipe(map(json => setJSON(json, 'totalDelay', difference(json))))
}


function delayExport(observable) {
   function difference(json) {
      if (json.history === undefined) {
         return 0
      }
      else {
         let lastIndex = json.history.length - 1
         return json['timestamp'] - json['history'][lastIndex].timestamp
      }
   }
   return observable
      .pipe(map(json => setJSON(json, 'delay', difference(json))))
}

function completeExport(observable) {
   return observable
      .pipe(timestampExport,
         delayExport,
         totalDelayExport,
         historyExport,
      )
}

// eslint-disable-next-line import/no-anonymous-default-export
export { vanillaExport, minimalExport, totalDelayExport, historyExport, timestampExport, delayExport, completeExport, getExporter, setExporter}