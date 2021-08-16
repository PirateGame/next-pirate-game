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

async function createGame(gameName: string, gridSizex: number, gridSizey: number) {
    var result = await prisma.game.create({
        data: {
            name: gameName,
            sizeX: gridSizex,
            sizeY: gridSizey,
            quickPlay: false,
            turnTime: 30,
            turnNumber: 0,
            chosenTiles: {},
            scoreHistory: {},
            playerLimit: 12,
            randomiseOnly: false

        }
    })
    
    //this is where we need to start the kubernetes pod
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        var gameName = req.body.gameName
        var playerName = req.body.playerName
        var gridSizex = req.body.gridSizex
        var gridSizey = req.body.gridSizey

        if (findGame(gameName) !== null) {
            //game with name exists
            res.status(500).json({error: true, message: "game with same name already exists"})
        } else {
            createGame(gameName, gridSizex, gridSizey)
        }
    }
}