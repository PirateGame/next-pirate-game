import type {NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

async function updatePlayer(gameName: string, playerName: string, ship: number, captain: number){
    var result = await prisma.player.updateMany({
        where: {
            gameName: gameName,
            name: playerName
        },
        data: {
            ship: ship,
            captain: captain,
        }
    })
    return result
}


export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        var gameName = req.body.gameName
        var playerName = req.body.playerName
        var ship = parseInt(req.body.ship)
        var captain = parseInt(req.body.captain)
        var result = updatePlayer(gameName, playerName, ship, captain)

        if (result == null) {
            res.status(500).json({error: true, message: "game settings update failed"})
            return
        } else {
            res.status(200).json({error: false, update: result})
            return
        }
    }
}