import Router from 'next/router'
import Link from 'next/link'
import Layout from '../components/Layout'
import React, { useState } from 'react';
import cookie from 'js-cookie'
import { io } from "socket.io-client";
import router from 'next/router';
import { toast } from 'react-toastify';


export default function Host(){
    const [gameName, setGameName] = useState("")
    var [Sizex, setX] = useState("7")
    var [Sizey, setY] = useState("7")
    const [playerName, setPlayerName] = useState("")

    const createGame = async(e: React.SyntheticEvent) => {
        e.preventDefault()
        var gridSizex = parseInt(Sizex)
        var gridSizey = parseInt(Sizey)
        const body = {gameName, playerName, gridSizex, gridSizey}
        await fetch('/api/createGame', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(body),
        })
        .then((r) => r.json())
        .then(async (data) => {
            if (data && data.error == true) {
                console.log(data.error)
                toast(data.message, {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            }
            else if (data && data.error == false) {
                const body = {gameName, playerName, host: true}
                await fetch('/api/createPlayer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify(body),
                })
                .then((r) => r.json())
                .then((data) => {
                    if (data && data.error == true) {
                        toast(data.message, {
                            position: toast.POSITION.BOTTOM_RIGHT
                        });
                    }
                    else if (data && data.error == false) {
                        toast("connecting to server", {
                            position: toast.POSITION.BOTTOM_RIGHT
                        });
                        var socket = io("http://localhost:1001")

                        if (socket == null) {
                            toast("not connected to server", {
                                position: toast.POSITION.BOTTOM_RIGHT
                            });
                        }
                        toast("Registering with server", {
                            position: toast.POSITION.BOTTOM_RIGHT
                        });
                        socket.emit("Register", playerName, gameName, (response: any) => {
                            cookie.set('token', response.token)
                        });
                        cookie.set('gameName', gameName, {expires: 1})
                        cookie.set('playerName', playerName, {expires: 1})
                        router.push('/HostPanel')
                    }
                })
            }
            else {
                console.log("error in Host.tsx createGame() failed")
            }
        })
    }
    return (
        <Layout>
            <div className="bg-generic">
                <div className="config-box config-box-center">
                    <br />
                    <h2 className="title1">Host</h2>
                    <form action="play" className="h-4/5">
                        <h3 className="float-left title3">Grid Size</h3>
                        <h3 className="float-left title3">{ Sizex } x { Sizey }</h3>
                        <div className="input-container">
                            <input
                                type="range"
                                min="5"
                                max="12"
                                onChange={e => setX(e.target.value)}
                                className="slider"
                            />
                            <input
                                type="range"
                                min="5"
                                max="15"
                                onChange={e => setY(e.target.value)}
                                className="slider"
                            />
                        </div>
                        <h3 className="float-left title3">Game Name</h3>
                        <div className="input-container">
                            <input type="text"
                                className="text-box"
                                placeholder=" Please enter a game id..."
                                onChange={e => setGameName(e.target.value)}
                            />
                        </div>
                        <h3 className="float-left title3">Player Name</h3>
                        <div className="input-container">
                            <input
                                type="text"
                                className="text-box"
                                placeholder=" Please enter your name..."
                                onChange={e => setPlayerName(e.target.value)}
                            />
                        </div>
                        <div className="h-1/6 p-5 m-auto text-center bg-opacity-25">
                            <input
                            type="button"
                            value="Create"
                            className="big-button bg-index-2 bg-opacity-25 cursor-pointer"
                            onClick={createGame}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    )
}