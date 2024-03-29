import Layout from '../components/Layout'
import React, { useState, useEffect } from 'react';
import 'gridstack/dist/gridstack.min.css';
import 'gridstack/dist/gridstack-extra.min.css';
import { GridStack } from 'gridstack';
import { io, Socket } from "socket.io-client";
import Script from 'next/script'


import 'gridstack/dist/h5/gridstack-dd-native';
//if this line breaks (document not found)
//go to \h5\dd-utils.js and remove the lines with document
//set supports passive to true

import cookie from 'js-cookie'
import router from 'next/router';
import { toast } from 'react-toastify';


const DesignBoard = () => {
    const gameName = cookie.get("gameName")
    const playerName = cookie.get("playerName")
    const gridHeight = parseInt(cookie.get("gridY") || "0")
    const gridWidth = parseInt(cookie.get("gridX") || "0")
    var tiles: any
    try {
        var tiles = JSON.parse(cookie.get("tiles") || "")
    }
    catch (err) {
        //router.push('/PickTeam')
    }
    var main: any
    var secondary: any

    if (gridWidth != 0) {
        var gridclass: string = "grid-stack grid-stack-" + gridWidth
    } else {
        var gridclass: string = "grid-stack"
    }



    const submitBoard = () => {
        var serializedData = main.save();
        if (serializedData.length != gridHeight * gridWidth) {
            toast("Board not valid", {
                position: toast.POSITION.BOTTOM_RIGHT
            });
            return
        } else {
            //board has correct number of tiles
            var board: any = [];
            for (var tile in serializedData) {
                var x = serializedData[tile].x
                var y = serializedData[tile].y
                board.push({ "x": x, "y": y, "content": serializedData[tile].content, "id": (y) * gridWidth + (x) })
            }
        }

        var _socket = io(process.env.SOCKET_URL as string)
        if (!_socket) return
        var connection = _socket

        if (!connection) {
            toast("not connected to server", {
                position: toast.POSITION.BOTTOM_RIGHT
            });
            return
        }

        connection.emit("submitBoard", gameName, playerName, board, (response: any) => {
            if (response.status != "ok") {
                toast(response.status, {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            } else {
                router.push('/WaitingRoom')
            }
        })
    }

    const randomiseBoard = () => {
        main.removeAll();
        secondary.removeAll();
        main.load(tilesToBoard(tiles, true))
    }

    const clearBoard = () => {
        main.removeAll();
        secondary.removeAll();
        secondary.load(tilesToBoard(tiles, false))
    }

    const tilesToBoard = (tiles: any[], positions: boolean) => {
        /*
        This function takes the list of tiles and translates them to be able to be sent to gridstack
        if we don't require positions (eg sidebar) then we can just give each tile an id and some extra atributes

        if we want positions, this function only returns random positions (randomise button)

        */
        var board: any = [];
        var positionValues: any = []

        for (var x = 0; x < gridWidth; x++) {
            for (var y = 0; y < gridHeight; y++) {
                positionValues.push([x, y])
            }
        }

        //loop through tiles array
        //{"A": 1, "B": 1, "C": 1, "D": 1, and so on.
        for (const [key, value] of Object.entries(tiles)) {
            for (var i = 0; i < value; i++) {
                var content = key.toString()

                if (positions) {
                    //chose position from list
                    var index = Math.floor(Math.random() * positionValues.length)
                    var x: number = positionValues[index][0]
                    var y: number = positionValues[index][1]
                    //remove chosen position from list
                    positionValues.splice(index, 1)

                    board.push({ "x": x, "y": y, "w": 1, "h": 1, "content": content, "noResize": true })
                } else {
                    board.push({ "content": content, "noResize": true })
                }
            }
        }
        return board
    }

    useEffect(() => {
        if (tiles.length == 0) {
            return
        }
        console.log("loading grids")

        var mainoptions = {
            dragIn: '.grid-stack-item',
            dragInOptions: { revert: 'invalid', scroll: false, appendTo: 'body', helper: 'clone' },
            acceptWidgets: function (el: any) { return true; },
            minRow: gridHeight,
            maxRow: gridHeight,
            float: true,
            column: gridWidth
        };
        var secondaryoptions = {
            dragIn: '.grid-stack-item',
            dragInOptions: { revert: 'invalid', scroll: false, appendTo: 'body', helper: 'clone' },
            acceptWidgets: function (el: any) { return true; },
            minRow: 1,
            float: false,
            column: 1,
            cellHeight: 50,
        };

        main = GridStack.init(mainoptions, document.getElementById("main")!)
        secondary = GridStack.init(secondaryoptions, document.getElementById("secondary")!)

        secondary.load(tilesToBoard(tiles, false))
    }, [])

    return (
        <Layout>
            <Script src="node_modules/gridstack/dist/gridstack-h5.js"></Script>
            <div className="bg-gamepage">
                <h2 className="title2">Drag and drop the tiles to create your board.</h2>
                <div className="flex-container w-full h-1/5">
                    <div className="flex-child">
                        <input
                            type="button"
                            value="Randomise"
                            className="big-button bg-green text-white no-underline"
                            onClick={randomiseBoard}
                        />
                    </div>
                    <div className="flex-child">
                        <input
                            type="button"
                            value="Clear"
                            className="big-button bg-red text-white no-underline"
                            onClick={clearBoard}
                        />
                    </div>
                    <div className="flex-child">
                        <input
                            type="button"
                            value="Submit"
                            className="big-button bg-blue text-white no-underline"
                            onClick={submitBoard}
                        />
                    </div>
                    <div className="flex-child flex-grow">

                    </div>
                </div>
                <div className="board-holder">
                    <div className={gridclass} id="main">

                    </div>
                </div>
                <div className="board-holder-narrow">

                    <div className="board-scroll">
                        <div className="grid-stack grid-stack-1" id="secondary"></div>
                    </div>

                </div>
            </div>
        </Layout>
    )
}

export default DesignBoard