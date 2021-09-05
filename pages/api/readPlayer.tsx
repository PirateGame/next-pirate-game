import type {NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

async function getPlayer(gameName: string, playerName: string){
    var result = await prisma.player.findMany({
        where: {
            gameName: gameName,
            name: playerName
        }
    })
    return result
}


export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        var gameName = req.body.gameName
        var playerName = req.body.playerName
        var result = await getPlayer(gameName, playerName)

        if (result == null) {
            res.status(500).json({error: true, message: "player not found"})
            return
        } else {
            res.status(200).json({error: false, player: result})
            return
        }
    }
}