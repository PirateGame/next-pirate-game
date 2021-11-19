import Router from 'next/router'
import Link from 'next/link'
import Layout from '../components/Layout'
import React, {useEffect, useState} from 'react';
import Griddle, { plugins, RowDefinition, ColumnDefinition } from 'griddle-react';
import { ToastContainer, toast } from 'react-toastify'


const AdminPanel = () => {

    const [data, setData] = useState<any[]>()

    const getGames = async() => {
        var res: any[] = []
        await fetch('/api/readGames', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'}
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
                //do stuff here
                var games = data.games
                for(var i in games) {
                    console.log(games[i])
                    //var numPlayers = Object.keys(games[i].scoreHistory[1]).length
                    var numPlayers = "?"
                    //could see how many players have gameName
                    // do a / then max numer of players.
                    console.log("here")
                    var gameName = games[i].name
                    var state = games[i].state
                    var maxPlayers = games[i].playerLimit
                    var gridx = games[i].sizeX
                    var gridy = games[i].sizeY
                    var turn = games[i].turnNumber
                    res.push({
                        gameName: gameName,
                        numPlayers: numPlayers + "/" + maxPlayers,
                        grid: gridx + "," + gridy,
                        turn: turn + "/" + gridx * gridy,
                        state: state,
                        id: gameName
                        })
                }
                setData(res)
                return
            }
            else {
                console.log("error in AdminPanel.tsx getGames() failed")
            }
        })
    }

    const deleteGame = (gameName: string) => {
        console.log(gameName)
    }

    const modifyGame = (gameName: string) => {
        console.log(gameName)
    }

    useEffect(() => {
        if (data == undefined) {
            getGames()
            return
        }
    }, [data])


    const styleConfig = {
        icons: {
            TableHeadingCell: {
                sortDescendingIcon: '▼',
                sortAscendingIcon: '▲'
            },
        },
        classNames: {
          Row: 'row-class',
          Table: 'w-full'
        },
        styles: {
          Filter: { fontSize: 18 }
        }
    }

    const sortProperties = [
        { id: 'state', sortAscending: true }
    ];

    const Actions = (value:string) => {
        return (
            <div>
            <input
                className="p-1 m-1"
                type="button"
                value="edit"
                onClick={e => modifyGame(value)}
            />
            <input
                className="p-1 m-1"
                type="button"
                value="remove"
                onClick={e => deleteGame(value)}
            />
        </div>
        )
        
        }

    return (
        <Layout>
            <div className="bg-generic">
            <br /><br /><br /><br />
                <div className="rules-box">
                    <h1 className="title1">Admin Panel</h1>
                    <Griddle
                        data={data}
                        styleConfig={styleConfig}
                        plugins={[plugins.LocalPlugin]}
                        sortProperties={sortProperties}
                    > 
                        <RowDefinition>
                            <ColumnDefinition id="gameName"  title="Game Name"/>
                            <ColumnDefinition id="numPlayers"  title="No. Players"/>
                            <ColumnDefinition id="turn"  title="Turn"/>
                            <ColumnDefinition id="grid"  title="Grid Size"/>
                            <ColumnDefinition id="state"  title="Game State"/>
                            <ColumnDefinition id="id" title="Actions" customComponent={Actions} />
                        </RowDefinition>
                    </Griddle>
                </div>
            </div>
        </Layout>
    )
}

export default AdminPanel