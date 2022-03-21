import React, { useRef, useState, useEffect } from 'react'
import { setExporter, completeExport, vanillaExport, minimalExport } from './exports'
import { loadModel } from './streams';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import { logToApp } from './Utilities.js';
import { createRaven } from './source';

// setExporter(completeExport)
function Subscription(props) {
    const webcamRef = props.webcam
    const canvasRef = props.canvas
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

    const exporters = [completeExport, vanillaExport, minimalExport]
    const names = ["Complete", "Vanilla", "Minimal"]

      function updateExporter(eventKey) {
    //access the right export function and set it as exporter
    setExporter(exporters[eventKey])
    //confirm to the user and if the stream is running, remind them to resubscribe to the stream
    logToApp(`Changed output to ${names[eventKey]}. ` + (running.current ? "Please stop and resume the stream" : ""), "appLog")
  }

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
            <LoadMediaPipeButton></LoadMediaPipeButton>
            <Button variant={(running.current ? "danger" : "success")} id="toggle" onClick={e => toggleSub()}>{buttonText}</Button>
            <Dropdown onSelect={(eventKey, event) => updateExporter(eventKey)}>
                <Dropdown.Toggle variant="light" id="dropdown-button-drop-right">
                    Change Output Settings
                </Dropdown.Toggle>
                <Dropdown.Menu variant="dark">
                    <Dropdown.Item eventKey={0}>Complete</Dropdown.Item>
                    <Dropdown.Item eventKey={1}>Vanilla</Dropdown.Item>
                    <Dropdown.Item eventKey={2}>Minimal</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </Container>
    )
}

export {Subscription}