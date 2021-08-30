import Router from 'next/router'
import Link from 'next/link'
import Layout from '../components/Layout'
import { toast } from 'react-toastify';
import cookie from 'js-cookie'
import React, { useState, useEffect } from 'react';


export default function PickTeam(){
    const gameName = cookie.get("gameName")
    const playerName = cookie.get("playerName")
    const [captain, setCaptain] = useState(-1)
    const [ship, setShip] = useState(-1)

    const showShip = () => { 
        var x = document.getElementById("captain");
        x.style.display = "none";
        var y = document.getElementById("ship");
        y.style.display = "block";
        
    }
    const submit = async () => {
        //save to database
        //read from database if randomise only.
        //push to waiting room or design board.
        const body = {gameName, playerName}
        await fetch('/api/updatePlayer', {
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
            else {
                console.log("error in Hostpanel.tsx saveSettings() failed")
            }
        })
    }

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
                                    name="captain"
                                    onChange={e => setCaptain(0)}
                                    className="radio-hidden"
                                    onClick={showShip}
                                />
                                <img src="/images/placeholder.png" height="150" width="250"/>
                                <div className="title3"> captain Hook </div>
                            </label>
                        </div>
                        <div className="flex-child">
                            <label>
                                <input
                                    type="radio"
                                    name="captain"
                                    onChange={e => setCaptain(1)}
                                    className="radio-hidden"
                                    onClick={showShip}
                                />
                                <img src="/images/placeholder.png" height="150" width="250"/>
                                <div className="title3"> Blackbeard </div>
                            </label>
                        </div>
                        <div className="flex-child">
                            <label>
                                <input
                                    type="radio"
                                    name="captain"
                                    onChange={e => setCaptain(2)}
                                    className="radio-hidden"
                                    onClick={showShip}
                                />
                                <img src="/images/placeholder.png" height="150" width="250"/>
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
                                    name="ship"
                                    onChange={e => setShip(0)}
                                    className="radio-hidden"
                                    onClick={submit}
                                />
                                <img src="/images/placeholder.png" height="150" width="250"/>
                                <div className="title3"> Jolly Rodger </div>
                            </label>
                        </div>
                        <div className="flex-child">
                            <label>
                                <input
                                    type="radio"
                                    name="ship"
                                    onChange={e => setShip(1)}
                                    className="radio-hidden"
                                    onClick={submit}
                                />
                                <img src="/images/placeholder.png" height="150" width="250"/>
                                <div className="title3"> Barnacle </div>
                            </label>
                        </div>
                        <div className="flex-child">
                            <label>
                                <input
                                    type="radio"
                                    name="ship"
                                    onChange={e => setShip(2)}
                                    className="radio-hidden"
                                    onClick={submit}
                                />
                                <img src="/images/placeholder.png" height="150" width="250"/>
                                <div className="title3"> Ocean's Raider </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}