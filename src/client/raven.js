import React, { useRef, useState } from 'react'
import { loadModel } from './streams';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { logToApp } from './Utilities.js';
import { createRaven } from './source';
import Col from 'react-bootstrap/Col';
import Webcam from 'react-webcam'

// setExporter(completeExport)
function Subscription(props) {
    const webcamRef = useRef(null)
    const canvasRef = useRef(null)
    const subscription = props.sub
    const [buttonText, setButtonText] = useState("Start")
    const [loaded, setLoaded] = useState(false)
    const [sub, setSub] = useState(false)
    const running = useRef(false);

    const raven = useRef(createRaven(webcamRef, canvasRef))
    function startRaven() {
        raven.current = createRaven(webcamRef, canvasRef)
        console.log("subscribed")
        setSub(raven.current.subscribe(subscription))
    }

    function stopRaven() {
        sub.unsubscribe()
        setSub(false)
    }

    //exporter code

    // const exporters = [completeExport, vanillaExport, minimalExport]
    // const names = ["Complete", "Vanilla", "Minimal"]

  //     function updateExporter(eventKey) {
  //   //access the right export function and set it as exporter
  //   setExporter(exporters[eventKey])
  //   //confirm to the user and if the stream is running, remind them to resubscribe to the stream
  //   logToApp(`Changed output to ${names[eventKey]}. ` + (running.current ? "Please stop and resume the stream" : ""), "appLog")
  // }

    // useEffect(()=> {
    //     if (sub){
    //         console.log("subscribed")
    //         const subscription = raven.current.subscribe(telloSubscriber(send));
    //         return () => subscription.unsubscribe();
    //     }
    //     else {console.log("Not Subscribed")}
    // })

    function toggleSub() {
        if (!running.current) {
            startRaven()
            setButtonText("Stop")
            if (!loaded) {
                setLoaded(true)
            }
        }
        else {
            stopRaven()
            let ctx = canvasRef.current.getContext("2d")
            ctx.clearRect(0, 0, 640, 480)
            setButtonText("Resume")
        }
        running.current = !running.current
    }

    function LoadMediaPipeButton(props) {
        if (!loaded) {
          return (
            <Button variant="info" onClick={e => { logToApp("Loading Hand Detection Model", "appLog"); loadModel(); setLoaded(true); logToApp("Loaded Hand Detection Model", "appLog") }}>Load Mediapipe Model</Button>
          );
        }
        else return (<div></div>)
      }

    return (
        <Container>
            <Col>
            <Webcam
              mirrored={true}
              ref={webcamRef}
              style={{
                width: 640, height: 480,
                position: 'absolute',
                // position: 'relative',
              }}


            />

            <canvas
              ref={canvasRef}
              style={{
                width: 640, height: 480,
                transform: 'scaleX(-1)',
                // position: 'absolute',

              }}
            />
            </Col>
            <LoadMediaPipeButton></LoadMediaPipeButton>
            <Button variant={(running.current ? "danger" : "success")} id="toggle" onClick={e => toggleSub()}>{buttonText}</Button>
            {/*toggles Change Output Settings*/}
            {/* <Dropdown onSelect={(eventKey, event) => updateExporter(eventKey)}>
                <Dropdown.Toggle variant="light" id="dropdown-button-drop-right">
                    Change Output Settings
                </Dropdown.Toggle>
                <Dropdown.Menu variant="dark">
                    <Dropdown.Item eventKey={0}>Complete</Dropdown.Item>
                    <Dropdown.Item eventKey={1}>Vanilla</Dropdown.Item>
                    <Dropdown.Item eventKey={2}>Minimal</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown> */}
        </Container>
    )
}

export {Subscription}