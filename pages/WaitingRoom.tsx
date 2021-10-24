import Link from 'next/link'
import Layout from '../components/Layout'
import { toast } from 'react-toastify';
import cookie from 'js-cookie'
import React, { useState, useEffect } from 'react';
import { io, Socket } from "socket.io-client";
import router from 'next/router';
const dotenv = require('dotenv');


export default function WaitingRoom(){
    const gameName = cookie.get("gameName")
    const playerName = cookie.get("playerName")
    const [host, setHost] = useState(false)
    const [gameState, setGameState] = useState(0)
    const token = cookie.get("token")

    const isHost = async () => {
        const body = {gameName, playerName}
        await fetch('/api/readPlayer', {
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
                console.log(data)
            }
        })
    }

    const getGameState = async() => {
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
            else if (data) {
                setGameState(data.game.state)
                console.log(data)
                if(data.game.state == 2) {
                    router.push("/Game")
                }
            }
            else {
                console.log("error in WaitingRoom.tsx getGameState failed")
                console.log(data)
            }
        })
    }

    const startGame = async () => {
        var _socket = io("http://localhost:1001")
        if (!_socket) return
        _socket.emit("startGame", playerName, gameName, token)
        router.push('/Game')
    }

    useEffect(() => {
        isHost()
        getGameState()

        var _socket = io(process.env.SOCKET_URL as string)
        if (!_socket) return

        if (!_socket) {
            toast("not connected to server", {
                position: toast.POSITION.BOTTOM_RIGHT
            });
            return
        }

        _socket.emit("join", playerName, gameName, token, (response: any) => {
            if (response.status == false) {
                toast("couldn't join server room.", {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            } 
        })

        _socket.on("gameStateUpdate", (state: number)=> {
            setGameState(state)
        });

        _socket.on("gameStart", () => {
            router.push("/Game")
        });

    }, [gameName, playerName, token])
    
    return (
        <Layout>
            <div className="bg-generic">
                <h1 className="title1">You&#39;re In!</h1>
                <h2 className="title2">Please wait while the host starts the game.</h2>
                <h2 className="title2"> game state: {gameState.toString()} </h2>
                <h2 className="title2"> Host: {host.toString()} </h2>

                <div className="flex-vertical-box h-3/5">
                    <div className="flex-child h-1/4 text-center">
                        <input
                            type="button"
                            value="Rules"
                            className="big-button bg-genericButton text-white no-underline w-1/2 m-2"
                            onClick={()=>router.push("/Rules")}
                        />
                    </div>
                    {host ? (
                        <div className="flex-child h-1/4">
                            {gameState ? (
                            <div className="h-full text-center">
                                <input
                                    type="button"
                                    value="Play"
                                    className="big-button bg-green text-white w-1/2 no-underline m-2"
                                    onClick={startGame}
                                />
                                </div>
                                ) : (
                                <br />
                            )}
                        </div>
                    ):(
                        <div></div>
                    )}
                </div>
            </div>
        </Layout>
    )
}