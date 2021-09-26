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
    const [tiles, setTiles] = useState()
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
        grids[1].load(tiles) //TODO this won't work as it is just how many of each tile.
        grids[0].load([{content: '£5000',noResize: true, noMove:false}]);
    }
    
    useEffect(() => {
        console.log("loading grids")
        const fetchData = async () => {
            await getGrid()
        }

        generateGrid()
        
        var MANDATORYitems = [
            {content: '£5000',noResize: true, noMove:false}
        ];

        var grids = GridStack.initAll({
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
        grids[1].cellHeight(50)// = 50; //pixels
        grids[1].load(tiles)
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