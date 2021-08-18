import type {NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

async function updateGame(gameName: string, decisionTime: number, randomiseOnly: boolean, playerLimit: number){
    var result = await prisma.game.update({
        where: {
            name: gameName,
        },
        data: {
            decisionTime: decisionTime,
            randomiseOnly: randomiseOnly,
            playerLimit: playerLimit
        }
    })
    return result
}


export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        var gameName = req.body.gameName
        var decisionTime = parseInt(req.body.decisionTime)
        var randomiseOnly = (req.body.randomiseOnly === 'true')
        var playerLimit = parseInt(req.body.playerLimit)
        var result = updateGame(gameName, decisionTime, randomiseOnly, playerLimit)

        if (result == null) {
            res.status(500).json({error: true, message: "game settings update failed"})
            return
        } else {
            res.status(200).json({error: false, update: result})
            return
        }
    }
}