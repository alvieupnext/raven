import React, { useRef, useState, useEffect } from 'react'
import { setExporter, completeExport } from './exports'
import { loadModel } from './streams';
import { consoleSubscriber, logSubscriber, telloSubscriber } from './subscribers';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import { logToApp } from './Utilities.js';
import { createRaven } from './source';

// setExporter(completeExport)
function Subscription(props) {
    const webcamRef = props.webcam
    const canvasRef = props.canvas
    const send = props.send
    const [buttonText, setButtonText] = useState("Start")
    const [loaded, setLoaded] = useState(false)
    const [sub, setSub] = useState(false)
    const running = useRef(false);

    const raven = useRef(createRaven(webcamRef, canvasRef))
    function startRaven() {
        setSub(raven.current.subscribe(consoleSubscriber))
    }

    function stopRaven() {
        sub.unsubscribe()
        setSub(false)
    }

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
            <Button variant={(running.current ? "danger" : "success")} id="toggle" onClick={e => console.log(sub)}>Kenny</Button>
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