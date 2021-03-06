import Link from 'next/link'
import React, { useState } from 'react';
import Layout from '../components/Layout'
import cookie from 'js-cookie'
import router from 'next/router';
import { io } from "socket.io-client";
import { toast } from 'react-toastify';


const Join = () => {
    const [gameName, setGameName] = useState("")
    const [playerName, setPlayerName] = useState("")

    const joinGame = async(e: React.SyntheticEvent) => {
        e.preventDefault()
        const body = {gameName, playerName, host: false}
        await fetch('/api/createPlayer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(body),
        })
        .then((r) => r.json())
        .then((data) => {
            if (data && data.error == true) {
                console.log(data.message)
                toast(data.message, {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            }
            else if (data && data.error == false) {
                toast("connecting to server", {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
                const socket = io(process.env.SOCKET_URL as string)
                        
                socket.on("connect", () => {
                    toast("Registering with server", {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                    socket.emit("Register", gameName, playerName, (response: any) => {
                        cookie.set('token', response.token)
                    });
                    cookie.set('gameName', gameName)
                    cookie.set('playerName', playerName)
                    router.push('/PickTeam')
                    });

                socket.io.on("error", (error) => {
                    toast("could not connect to server", {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                    socket.disconnect()
                    return
                })
            }
            else {
                console.log("error in join.tsx createPlayer() failed")
            }
        })
    }

    return (
        <Layout>
            <div className="bg-generic">
                <div className="config-box config-box-center">
                    <br/>
                    <h2 className="title1">Join</h2>
                    <form className=" h-4/5">
                        <h3 className="float-left title3">Game Name</h3>
                        <div className="input-container">
                            <input
                                type="text"
                                className="text-box"
                                placeholder="Game Name..."
                                onChange={e => setGameName(e.target.value)}
                            />
                        </div>
                        <h3 className="float-left title3">Player Name</h3>
                        <div className="input-container">
                            <input
                                type="text"
                                className="text-box"
                                placeholder="Name"
                                onChange={e => setPlayerName(e.target.value)}
                            />
                        </div>
                        <div className="h-1/6 p-5 m-auto text-center bg-opacity-25">
                            <input
                                type="button"
                                value="Join"
                                className="big-button bg-index-2 bg-opacity-25 cursor-pointer"
                                onClick={joinGame}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default Join