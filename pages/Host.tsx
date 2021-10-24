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
        var tiles = generateTiles(gridSizex, gridSizey)
        const body = {gameName, playerName, gridSizex, gridSizey, tiles}
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
                .then(async (data) => {
                    if (data && data.error == true) {
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
                            socket.emit("Register", playerName, gameName, (response: any) => {
                                cookie.set('token', response.token)
                            });
                            cookie.set('gameName', gameName)
                            cookie.set('playerName', playerName)
                            router.push('/HostPanel')
                          });

                        socket.io.on("error", (error) => {
                            toast("could not connect to server", {
                                position: toast.POSITION.BOTTOM_RIGHT
                            });
                            socket.disconnect()
                            return
                        });
                    }
                })
            }
            else {
                console.log("error in Host.tsx createGame() failed")
            }
        })
    }

    const generateTiles = (gridSizeX: number, gridSizey: number) => {
        var gridSize = gridSizeX * gridSizey
        if (gridSize <= 25 ){
            var actionCount = 1
        } else {
            var actionCount = Math.round((gridSize + 12.5)/25)-1
        }
        var max5000 = Math.ceil(gridSize * (1/49))
        var max3000 = Math.ceil(gridSize * (2/49))
        var max1000 = Math.ceil(gridSize * (10/49))
        var max200 = Math.ceil(gridSize * (25/49))
        var totalActionCount = actionCount * 11
        var total = (max5000 + max3000 + max1000 + max200 + totalActionCount) - gridSize
        var minimum = toMinimize(max5000, max3000, max1000, max200, total, 0, 0, 0)

        var minimumInputs = [total,0,0,0]
        for (let max5000s = 0; max5000s < total; max5000s++){ //This tests all the possible board tile removal combinations.
            for (let max3000s = 0; max3000s <total-max5000s; max3000s++){
                for (let max1000s = 0; max1000s < (total-max5000s-max3000s); max1000s++){
                    for (let max200s = 0;  max200s < (total-max5000s-max3000s-max1000s); max200s++){
                        max200s += 1
                        if (max5000s + max3000s + max1000s + max200s == total){
                            let result = toMinimize(max5000, max3000, max1000, max200, max5000s, max3000s, max1000s, max200s)
                            if (result < minimum){
                                minimum = result
                                minimumInputs = [max5000s, max3000s, max1000s, max200s]
                            }
                        }
                    }
                }
            }
        }

        max5000 -= minimumInputs[0] //Remove the optimal combination from each type of money tile.
        max3000 -= minimumInputs[1]
        max1000 -= minimumInputs[2]
        max200 -= minimumInputs[3]

        var tiles: { [key: string]: any } = {}
        var letters = ["A","B","C","D","E","F","G","H","I","J","K"]
        for (let i = 0; i < letters.length; i++){
            tiles[letters[i]] = actionCount
        }
        tiles["5000"] = max5000
        tiles["3000"] = max3000
        tiles["1000"] = max1000
        tiles["200"] = max200

        return tiles

    }

    const toMinimize = (max5000: number, max3000: number, max1000: number, max200: number, max5000s: number, max3000s: number, max1000s: number, max200s: number) => {
        return Math.abs((((5000*(max5000-max5000s))+(3000*(max3000-max3000s))+(1000*(max1000-max1000s))+(200*(max200-max200s))) / ((max5000-max5000s)+(max3000-max3000s)+(max1000-max1000s)+(max200-max200s))) - ((((max5000)*5000)+((max3000)*3000)+((max1000)*1000)+((max200)*200)) / (max5000+max3000+max1000+max200))) 
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