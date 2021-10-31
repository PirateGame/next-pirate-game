import Router from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '../components/Layout'
import { toast } from 'react-toastify';
import cookie from 'js-cookie'
import React, { useState, useEffect } from 'react';
import { io, Socket } from "socket.io-client";


export default function PickTeam(){
    const gameName = cookie.get("gameName")
    const playerName = cookie.get("playerName")
    const [captain, setCaptain] = useState(-1)
    const [ship, setShip] = useState(-1)
    const [randomiseOnly, setRandomiseOnly] = useState(false)

    

    const showShip = () => { 
        var x = document.getElementById("captain");
        if (!x) return
        x.style.display = "none";
        var y = document.getElementById("ship");
        if (!y) return
        y.style.display = "block";
        getGrid()
        
    }

    const getGrid = async () => {
        const body = {gameName, playerName}
        await fetch('/api/readGame', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(body),
        })
        .then((r) => r.json())
        .then((data) => {
            if (data && data.error == true) {
                console.log(data.error)
                toast(data.message, {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            }
            else if (data && data.game) {
                console.log(data.game)
                cookie.set('gridX', data.game.sizeX)
                cookie.set('gridY', data.game.sizeY)
                cookie.set('tiles', JSON.stringify(data.game.tiles))
            }
            else {
                console.log("error in DesignBoard.tsx getGrid() failed")
            }
        })
    }

    const isRandomiseOnly = async () => { 
        const body = {gameName, playerName}
        await fetch('/api/readGame', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(body),
        })
        .then((r) => r.json())
        .then((data) => {
            if (data && data.error == true) {
                console.log(data.error)
                toast(data.message, {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            }
            else if (data && data.game) {
                if (data.game.randomiseOnly) {
                    setRandomiseOnly(true)
                } else { setRandomiseOnly(false)}
            }
            else {
                console.log("error in PickTeam.tsx isRandomiseOnly() failed")
            }
        })
    }

    const submit = async () => {
        //save to database
        //read from database if randomise only.
        //push to waiting room or design board.

        var _socket = io(process.env.SOCKET_URL as string)
        if (!_socket) return
        console.log(_socket)
        var connection = _socket //this does work

        if (!connection) {
            toast("not connected to server", {
                position: toast.POSITION.BOTTOM_RIGHT
            });
            return
        }

        connection.emit("setTeam", playerName, gameName, ship, captain, (response: any) => {
            if (response.status != "ok") {
                toast(response.status, {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            } else {
                if (randomiseOnly) {
                    Router.push("/WaitingRoom")
                } else {
                    Router.push("/DesignBoard")
                }
            }
        })
    }

    useEffect(()=>{
        if (captain == -1) return
        console.log(captain)
        isRandomiseOnly()
        showShip()
    },[captain])

    useEffect(()=>{
        if (ship == -1) return
        console.log(ship)
        submit()
    },[ship])

    return (
        <Layout>
            <div className="bg-gamepage">
                <h1 className="title1">Pick your captain and ship</h1>
                <div className="team-selector" id="captain">
                    <br/>
                    <h2 className="title2">Captain</h2>
                    <div className="flex-container">
                        <div className="flex-child">
                            <label>
                                <input
                                    type="radio"
                                    className="radio-hidden"
                                    onClick={e => setCaptain(0)}
                                />
                                <Image src="/images/placeholder.png" height="150" width="250" alt=""/>
                                <div className="title3"> captain Hook </div>
                            </label>
                        </div>
                        <div className="flex-child">
                            <label>
                                <input
                                    type="radio"
                                    className="radio-hidden"
                                    onClick={e => setCaptain(1)}
                                />
                                <Image src="/images/placeholder.png" height="150" width="250" alt=""/>
                                <div className="title3"> Blackbeard </div>
                            </label>
                        </div>
                        <div className="flex-child">
                            <label>
                                <input
                                    type="radio"
                                    className="radio-hidden"
                                    onClick={e => setCaptain(2)}
                                />
                                <Image src="/images/placeholder.png" height="150" width="250" alt=""/>
                                <div className="title3"> Jack Sparrow </div>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="team-selector hidden" id="ship">
                    <br/>
                    <div className="title2">Ship</div>
                    <div className="flex-container">
                        <div className="flex-child">
                            <label>
                                <input
                                    type="radio"
                                    className="radio-hidden"
                                    onClick={e => setShip(0)}
                                />
                                <Image src="/images/placeholder.png" height="150" width="250" alt=""/>
                                <div className="title3"> Jolly Rodger </div>
                            </label>
                        </div>
                        <div className="flex-child">
                            <label>
                                <input
                                    type="radio"
                                    className="radio-hidden"
                                    onClick={e => setShip(1)}
                                />
                                <Image src="/images/placeholder.png" height="150" width="250" alt=""/>
                                <div className="title3"> Barnacle </div>
                            </label>
                        </div>
                        <div className="flex-child">
                            <label>
                                <input
                                    type="radio"
                                    className="radio-hidden"
                                    onClick={e => setShip(2)}
                                />
                                <Image src="/images/placeholder.png" height="150" width="250" alt=""/>
                                <div className="title3"> Ocean&#39;s Raider </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}