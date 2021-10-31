import Router from 'next/router'
import Link from 'next/link'
import Layout from '../components/Layout'
import Chart from 'chart.js/auto';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import cookie from 'js-cookie'

interface data {
    labels: string,
    datasets: string[]
}

export default function Leaderboard(){
    const gameName = cookie.get("gameName")
    const playerName = cookie.get("playerName")
    const [datasets, setDatasets] = useState()
    const [labels, setLabels] = useState()

    function getRandomColour() {
        var letters = '0123456789ABCDEF'.split('');
        var colour = '#';
        for (var i = 0; i < 6; i++ ) {
            colour += letters[Math.floor(Math.random() * 16)];
        }
        return colour;
    }

    const getGameHistory = async () => {
        const body = {gameName}
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
                var scoreHistory = data.game.scoreHistory

                var numPlayers = Object.keys(scoreHistory[1]).length
                var numTurns = Object.keys(scoreHistory).length
                var datasets: any = []
                var labels: any = []
                
                for (var i = 1; i < numTurns; i++) {
                    labels.push(i);
                }

                for(var i = 0; i < numPlayers; i ++) {
                    datasets.push({})
                    
                    datasets[i]["label"] = Object.keys(scoreHistory[1])[i]
                    var data: any = []
                    for (var j = 1; j <= numTurns; j++) {
                        data.push(scoreHistory[j][Object.keys(scoreHistory[j])[i]])
                    }
                    datasets[i]["data"] = data
                    datasets[i]["backgroundColor"] = getRandomColour()
                    datasets[i]["borderColor"] =  getRandomColour()
                    datasets[i]["fill"] = false
                    
                }
                setLabels(labels)
                setDatasets(datasets)
                return
            }
            else {
                console.log("error in DesignBoard.tsx getGrid() failed")
            }
        })
    }


    useEffect(() => {
        if (datasets == undefined || datasets == null) {
            getGameHistory()
            return
        }
        console.log(datasets)
        console.log(labels)
        var ctx = document.getElementById('myChart') as HTMLCanvasElement
        if (ctx == null) {
            return
        }
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets,
            },
            options: {
                responsive: true,
				plugins: {
                    title: {
                        display: true,
                        text: 'Leaderboard',
                        font: {
                            size: 24
                        }
                    },
                    legend: {
                        position: 'top',
                    }
                },
				interaction: {
                    intersect: false,
                },
				scales: {
					x: {
						display: true,
						title: {
							display: true,
							text: 'Turn',
                            font: {
                                size: 24
                            }
						}
					},
					y: {
						display: true,
						title: {
							display: true,
							text: 'Gold Coins',
                            font: {
                                size: 24
                            }
						}
					}
				}
			}
        });
    }, [datasets])

    return (
        <Layout>
            <div className="bg-leaderboardpage">
                <div className="leaderboard">
                    <canvas id="myChart"></canvas>
                </div>
            </div>
        </Layout>
    )
}