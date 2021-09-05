import Router from 'next/router'
import Link from 'next/link'
import Layout from '../components/Layout'
import { toast } from 'react-toastify';
import cookie from 'js-cookie'
import React, { useState, useEffect } from 'react';


export default function WaitingRoom(){
    const gameName = cookie.get("gameName")
    const playerName = cookie.get("playerName")
    const [host, setHost] = useState(false)
    const [gameState, setGameState] = useState(false)

    const isHost = async () => { 
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
            else if (data && data.player) {
                if (data.player.host) {
                    setHost(true)
                } else { return false}
            }
            else {
                console.log("error in WaitingRoom.tsx isHost() failed")
            }
        })
    }

    const startGame = async () => { 
        //tell socket to start game
    }


    isHost()
    //get game state
    //listen to state updates
    //if state is ready update state
    //if state is started, push /Game

    
    return (
        <Layout>
            <div className="bg-generic">
                <h1 className="title">You're In!</h1>
                <h2>Please wait while the host starts the game.</h2>
                <h2>Here is a guide on how to play the game.</h2>
                <h2> game state: {gameState} </h2>

                <div className="flex-vertical-box h-3/5">
                    <div className="flex-child h-1/4">
                        <input
                            type="button"
                            value="Rules"
                            className="big-button bg-genericButton text-white no-underline w-1/2 m-2"
                        />
                    </div>
                    isHost ? (
                        <div className="flex-child h-1/4">
                            gameState ? (
                            <div className="h-full">
                                <input
                                    type="button"
                                    value="Play"
                                    className="big-button bg-red text-white no-underline w-1/2 m-2"
                                />
                                </div>
                                ) : (
                                <div v-show="isReady" className="h-full">
                                    <input
                                        type="button"
                                        value="Play"
                                        className="big-button bg-green text-white w-1/2 no-underline m-2"
                                        onClick={startGame}
                                    />
                                </div>
                            )
                        </div>
                    )
                </div>
            </div>
        </Layout>
    )
}