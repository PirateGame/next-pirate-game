import type {NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'


async function findGame(gameName: string){
    var result = await prisma.game.findUnique({
        where: {
            name: gameName,
        }
    })
    return result
}

async function createGame(gameName: string, gridSizex: number, gridSizey: number, tiles: any) {

    var order = []
    for(var x = 0; x < gridSizex; x++) {
        for(var y = 0; y < gridSizey; y++) {
            order.push([x,y])
        }
    }
    var tilesRemaining = {"tiles": order}

    var result = await prisma.game.create({
        data: {
            name: gameName,
            sizeX: gridSizex,
            sizeY: gridSizey,
            quickPlay: false,
            decisionTime: 30,
            tiles: tiles,
            turnNumber: 0,
            tilesRemaining: tilesRemaining,
            currentTile: {},
            scoreHistory: {},
            queue: [],
            state: 0,
            playerLimit: 12,
            randomiseOnly: false

        }
    })
    return result
    
    //this is where we need to start the kubernetes pod
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        var gameName = req.body.gameName
        var playerName = req.body.playerName
        var gridSizex = req.body.gridSizex
        var gridSizey = req.body.gridSizey
        var tiles = req.body.tiles

        if (await findGame(gameName) !== null) {
            //game with name exists
            res.status(500).json({error: true, message: "game with same name already exists"})
            return
        } else {
            var game = await createGame(gameName, gridSizex, gridSizey, tiles)
            if (game == null){
                //something failed
                res.status(500).json({error: true, message: "game creation failed"})
                return
            } else {
                //game creation worked
                res.status(200).json({error: false, game: game})
                return
            }
        }
    }
}