import Link from 'next/link'
import Layout from '../components/Layout'
import { toast } from 'react-toastify';
import cookie from 'js-cookie'
import React, { useState, useEffect } from 'react';
import { io, Socket } from "socket.io-client";
import router, { useRouter } from 'next/router';
import 'gridstack/dist/gridstack.min.css';
import 'gridstack/dist/gridstack-extra.min.css';
import { GridStack } from 'gridstack';
import 'gridstack/dist/h5/gridstack-dd-native';
import { setHttpAgentOptions } from 'next/dist/server/config';


const Game = () => {
    const gameName = cookie.get("gameName")
    const playerName = cookie.get("playerName")
    const [gameState, setGameState] = useState(1)
    const token = cookie.get("token")

    const [money, setMoney] = useState(0)
    const [bank, setBank] = useState(0)
    const [mirror, setMirror] = useState(0)
    const [shield, setShield] = useState(0)

    const [captain, setCaptain] = useState(-1)
    const [ship, setShip] = useState(-1)
    const [questionBool, setQuestionBool] = useState(false)
    const [question, setQuestion] = useState("")
    const [options, setOptions] = useState([])
    var board: any
    const [selectedOption, setSelectedOption] = useState("")
    
    const gridHeight = parseInt(cookie.get("gridY")|| "0")
    const gridWidth = parseInt(cookie.get("gridX")|| "0")
    const [connection, setConnection] = useState<Socket>()

    if (gridWidth != 0){
        var gridclass: string = "grid-stack grid-stack-" + gridWidth
    } else {
        var gridclass: string = "grid-stack"
    }

    const getBoard = async() => {
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
            else if (data) {
                board.removeAll();
                board.load(data.player.board)
                return
            }
            else {
                console.log("error in Game.tsx getBoard() failed")
            }
        })
    }

    const getStats = async() => {
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
            else if (data) {
                console.log(data)
                setMoney(data.player.money)
                setBank(data.player.bank)
                setMirror(data.player.mirror)
                setShield(data.player.shield)
                setShip(data.player.ship)
                setCaptain(data.player.captain)
                return
            }
            else {
                console.log("error in Game.tsx getStats() failed")
            }
        })
    }

    const addMessage = (message: string) => {
        var div = document.createElement('div');
        div.innerHTML = '<h3 name="event">' + message + '</h3>';
        

        div.className = 'message'
        
        var chat = document.getElementById("chat")
        if(chat == null) {
            return
        }
        if (chat.children.length % 2 == 0){
            div.className = 'message title3'
        } else {
            div.className = 'message-dark title3'
        }
        chat.insertBefore(div, chat.children[0]);
    }

    const clearAllMessages = () => {
        var log = document.getElementById("chat")
        if (log == null) {
            return
        }
        while (log.firstChild) {
            log.removeChild(log.firstChild);
        }
    }

    const getDoneTiles = async() => {
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
                var tilesRemaining = data.game.tilesRemaining

                var tilesDone: number[] = []
                for (var i = 0; i < gridWidth * gridHeight; i++){
                    if (tilesRemaining.indexOf(i) == -1)
                        tilesDone.push(i)
                }

                for (var i = 0; i < tilesDone.length; i++){
                    var tile = board.engine.nodes.find((n: any) => n.id === tilesDone[i])
                    tile.el.children[0].className = "old-square" 
                }


                return
            }
            else {
                console.log("error in Game.tsx getStats() failed")
            }
        })
    }

    const getCurrentTile = async() => {
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
                var currentTile = data.game.currentTile

                var latestTile = board.engine.nodes.find((n: any) => n.id === currentTile)
                console.log(latestTile.el.children[0])
                latestTile.el.children[0].className = "current-square"

                

                return
            }
            else {
                console.log("error in Game.tsx getStats() failed")
            }
        })
    }

    const submitResponse = () => {
        if (selectedOption == "") {
            toast("please select a valid option", {
                position: toast.POSITION.BOTTOM_RIGHT
            });
            return
        }
        setQuestionBool(false)
        if (connection) {
            connection.emit("questionResponse", playerName, gameName, selectedOption)
        }
    }

    useEffect(() => {
        console.log("loading grids")
        
        var boardoptions = {
            minRow: gridHeight,
            maxRow: gridHeight,
            float: true,
            column: gridWidth,
            disableDrag: true,
            staticGrid: true,
        };

        board = GridStack.init(boardoptions, document.getElementById("board")!)
        
        getBoard()
        getStats()
        

        var _socket = io(process.env.SOCKET_URL as string)
        if (!_socket) return
        setConnection(_socket)

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

        _socket.on("event", async(data: any)=> {
            addMessage(data.title)
            getStats()
            setQuestionBool(false)
            await getDoneTiles()
            await getCurrentTile()
            if (data.title == "Game Over.") {
                router.push("/Leaderboard")
            }
        });

        _socket.on("question", (title: string, options: any)=> {
            console.log("got question")
            setQuestionBool(true)
            setQuestion(title)
            setOptions(options)
        });
    }, [])

    return (
        <Layout>
            <div className="bg-gamepage">
                <h2 className="tooltip-wrap title1">The Pirate Game
                    <div className="tooltip-content board-holder title2"> Your name: {playerName} <br /> Game name: {gameName} <br /> Ship: {ship} <br /> Captain: {captain} </div>
                </h2>
                <div className="board-holder">
                    <div className={gridclass} id="board"></div>
                </div>
                <div className="right-bar">
                    <div className="flex-vertical-container h-full m-0">
                        <div className="flex-child">
                            <div className="flex-container m-0">
                                <h2 className="flex-child title2"> Game log </h2>
                            </div>
                        </div>
                        <div className="flex-child">
                            <div className="flex-container">
                                <div className="flex-child m-0">
                                    <h2 className="m-0 title3"> Stash: {money}</h2>
                                </div>
                                <div className="flex-child m-0">
                                    <h2 className="m-0 title3"> Chest: {bank}</h2>
                                </div>
                            </div>
                        </div>
                        <div className="flex-child">
                            <div className="flex-container">
                                <div className="flex-child m-0">
                                    <h2 className="m-0 title3"> Mirror: {mirror}</h2>
                                </div>
                                <div className="flex-child m-0">
                                    <h2 className="m-0 title3"> Shield: {shield}</h2>
                                </div>
                            </div>
                        </div>
                        <div className="flex-child flex-grow"> 
                            <div className="gameLog" id="chat">
                                <div className="message-dark title3">
                                    <h3> Welcome to the Pirate Game </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
                
                <br />
                {questionBool ? (
                    <div className="board-holder question" v-show="questionBool">
                        <div className="question-box">
                            <h3> {question} </h3>
                            <select
                                value={selectedOption}
                                onChange={e => setSelectedOption(e.target.value)}
                                >
                                <option disabled value="">Choose your option</option>
                                {options.map((option, key) => (
                                    <option key={key} value={option}>
                                    {option}
                                    </option>
                                ))}
                            </select>
                            <div className="h-1/6 p-5 m-auto text-center bg-opacity-25">
                            <input
                            type="button"
                            value="Submit"
                            className="big-button bg-index-2 bg-opacity-25 cursor-pointer"
                            onClick={submitResponse}
                            />
                        </div>
                        </div>
                    </div>
                    ) : (
                    <br />
                )}
            </div>
        </Layout>
    )
}

export default Game