import Router from 'next/router'
import Link from 'next/link'
import Layout from '../components/Layout'
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import cookie from 'js-cookie'
import { io, Socket } from "socket.io-client";


const HostPanel = () => {
    const [decisionTime, setDecisionTime] = useState("45")
    const [randomiseOnly, setRandomiseOnly] = useState(false)
    const [clientList, setClientList] = useState([])
    const [playerLimit, setPlayerLimit] = useState("20")
    const gameName = cookie.get("gameName")
    const playerName = cookie.get("playerName")
    const token = cookie.get("token")
    

    const startGame = () => { 
        Router.push('/PickTeam')
    }

    const saveSettings = async () => {
        const body = {gameName, decisionTime, randomiseOnly, playerLimit}
        await fetch('/api/updateGame', {
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
            else if (data && data.error == false) {
                toast("game settings have been updated", {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            }
            else {
                console.log("error in Hostpanel.tsx saveSettings() failed")
            }
        })
    }

    const getPlayers = async () => {
        var _socket = io(process.env.SOCKET_URL as string)
        if (!_socket) return
        _socket.emit("getPlayerList", playerName, gameName, (response: any) => {
            setClientList(response.playerList)
        });
    }

    const kickPlayer = async (playertoKick: string) =>{
        var token = cookie.get("token")
        toast("kicking players not implemented yet.", {
            position: toast.POSITION.BOTTOM_RIGHT
        });
    }
    
    const addAI = async () =>{
        var _socket = io(process.env.SOCKET_URL as string)
        if (!_socket) return
        _socket.emit("addAI", token, (response: any) => {
            if (response.status != "ok") {
                toast(response.status, {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            } 
        });
    }

    useEffect(() => {
        var _socket = io(process.env.SOCKET_URL as string)
        if (!_socket) return
        console.log(_socket)

        if (!_socket) {
            toast("not connected to server", {
                position: toast.POSITION.BOTTOM_RIGHT
            });
            return
        }
        getPlayers()

        _socket.emit("join", playerName, gameName, token, (response: any) => {
            if (response.status == false) {
                toast("couldn't join server room.", {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            } 
        })

        _socket.on("playerListUpdated", () => {
            getPlayers()
        })
    }, [gameName, playerName, token])

    return (
        <Layout>
            <div className="bg-generic">
                <div className="flex-container h-full">
                    <div className="config-box flex-child m-4">
                        <div className="flex-vertical-container w-full mb-0">
                            <h1 className="title2 flex-child">Host Panel</h1>
                            <h3 className=" title3 flex-child">Game Name: {gameName}</h3>
                            <div className="flex-child">
                                <h3 className="title3 float-left">Decision Time: {decisionTime}</h3>
                                <div className="input-container">
                                    <input
                                        type="range"
                                        min="10"
                                        max="120"
                                        step="5"
                                        value={decisionTime}
                                        onChange={e => setDecisionTime(e.target.value)}
                                        className="slider"
                                    />
                                </div>
                                <h3 className="title3 float-left">Player Limit: {playerLimit}</h3>
                                <div className="input-container">
                                    <input
                                        type="range"
                                        min="2"
                                        max="50"
                                        step="1"
                                        value={playerLimit}
                                        onChange={e => setPlayerLimit(e.target.value)}
                                        className="slider"
                                    />
                                </div>
                            </div>
                            <br/>
                            <div className="flex-child">
                                <div className="flex-container">
                                    <div className="flex-child">
                                        <input
                                            className="float-left"
                                            type="checkbox"
                                            name="Randomize only"
                                            onChange={e => setRandomiseOnly(e.target.checked)}
                                        />
                                        <label className="title3">Randomise Boards Only</label>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-child flex-grow">
                                <input
                                    type="button"
                                    value="Save"
                                    className="big-button bg-index-0 text-white no-underline opacity-60 m-3 justify-center cursor-pointer"
                                    onClick={saveSettings}
                                />
                                <input
                                    type="button"
                                    value="Add AI Player"
                                    className="big-button bg-index-1 text-white no-underline opacity-60 m-3 justify-center cursor-pointer"
                                    onClick={addAI}
                                />
                                <input
                                    type="button"
                                    value="Next"
                                    className="big-button bg-index-2 text-white no-underline opacity-60 m-3 justify-center cursor-pointer"
                                    onClick={startGame}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="config-box flex-child m-4 min-h-5/6">
                        <h1 className="title2">Players</h1>
                        <ul>
                            {clientList.map(client=><li className="title3 cursor-pointer hover:strikeout" key={client} onClick={() => kickPlayer(client)}>{client}</li>)}
                        </ul>
                        
                        
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default HostPanel