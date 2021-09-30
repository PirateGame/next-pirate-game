import Router from 'next/router'
import Link from 'next/link'
import Layout from '../components/Layout'
import React, { useState, useEffect } from 'react';
import 'gridstack/dist/gridstack.min.css';
import { GridStack } from 'gridstack';
import cookie from 'js-cookie'
import { toast } from 'react-toastify';


export default function DesignBoard(){
    const gameName = cookie.get("gameName")
    const playerName = cookie.get("playerName")
    const [gridHeight, setGridHeight] = useState(-1)
    const [gridWidth, setGridWidth] = useState(-1)
    const [tiles, setTiles] = useState([])
    var grids: any = [];


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
                setGridHeight(data.game.sizeX)
                setGridWidth(data.game.sizeY)
                setTiles(data.game.tiles)
            }
            else {
                console.log("error in DesignBoard.tsx getGrid() failed")
            }
        })
    }

    const submitBoard = () => {
        //write to db
    }

    const randomiseBoard = () => {
        //probably socket unless we do it client side
    }

    const generateGrid = () => {
        //probably socket unless we do it client side
    }

    const clearBoard = () => {
        grids[0].removeAll();
        grids[1].removeAll();
        grids[1].load(tilesToBoard(tiles, false))
        grids[0].load([{content: '£5000',noResize: true, noMove:false}]);
    }
    
    const tilesToBoard = (tiles: any[], positions: boolean) => {
        /*
        This function takes the list of tiles and translates them to be able to be sent to gridstack
        if we don't require positions (eg sidebar) then we can just give each tile an id and some extra atributes

        if we want positions, this function only returns random positions (randomise button)

        */
        var board: any = [];
        var positionValues: any = []

        for (var x = 0; x < gridWidth; x++){
            for (var y = 0; y < gridWidth; y++){
                positionValues.append([x,y])
            }
        }
        var idCounter = 0

        //loop through tiles array
        //{"A": 1, "B": 1, "C": 1, "D": 1, and so on.
        for (const [key, value] of Object.entries(tiles)) {
            for ( var i = 0; i < value; i++){
                var id = idCounter
                id++
                if (/\d/.test(key)){
                    continue
                    //change Letters to Tile names
                    //content = name
                } else {
                    var content = key.toString()
                }
                    
                if (positions) {
                    //chose position from list
                    var index = Math.floor(Math.random() * positionValues.length)
                    var x: number = positionValues[index][0]
                    var y: number = positionValues[index][1]
                    //remove chosen position from list
                    positionValues.splice(index, 1)

                    board.append({"x":x, "y":y, "w":1, "h":1, "id":id, "content":content, "noResize": true, "noMove":false})
                } else {
                    board.append({"id":id, "content":content, "noResize": true, "noMove":false})
                }
            }
        }
          return board
    }

    useEffect(() => {
        console.log("loading grids")
        const fetchData = async () => {
            await getGrid()
        }
        
        var MANDATORYitems = [
            {content: '£5000',noResize: true, noMove:false}
        ];
        
        grids = GridStack.initAll({
            dragIn: '.grid-stack-item',
            dragInOptions: { revert: 'invalid', scroll: false, appendTo: 'body', helper: 'clone' },
            acceptWidgets: function(el) { return true; },
            minRow: 1,
        });
        
        grids[0].float(true);
        grids[0].column(gridWidth);
        grids[0].opts.minRow = gridHeight;
        grids[0].opts.maxRow = gridHeight;
        grids[0].load(MANDATORYitems);
        grids[1].float(false);
        grids[1].column(1);
        grids[1].cellHeight(50)// pixels
        grids[1].load(tilesToBoard(tiles, false))
    }, [])

    return (
        <Layout>
            <div className="bg-gamepage">
                <h2 className="title2">Drag and drop the tiles to create your board, or hit the randomise button.</h2>
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
                    <div className="grid-stack">

                    </div>
                </div>
                <div className="board-holder-narrow">
                    
                    <div className="board-scroll">
                        <div className="grid-stack grid-stack-1"></div>
                    </div>
                    
                </div>
            </div>
        </Layout>
    )
}