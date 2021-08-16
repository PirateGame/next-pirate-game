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

async function joinGame(gameName: string, playerName: string) {
    var result = await prisma.player.create({
        data: {
            name: playerName,
            money: 0,
            bank: 0,
            shield: 0,
            mirror: 0,
            ship: 0,
            team: 0,
            Game: {
                connect: {name: gameName}
            }

        }
    })
    return result
    
    //this is where we need to start the kubernetes pod
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        var gameName = req.body.gameName
        var playerName = req.body.playerName

        var game = await findGame(gameName)
        if (game === null) {
            //game does not exist
            res.status(500).json({error: true, message: "game not found"})
            return
        }
        var joined = await joinGame(gameName, playerName)
        if (joined == null){
            //something failed
            res.status(500).json({error: true, message: "failed to join game"})
            return
        } else {
            //game creation worked
            res.status(200).json({error: false, game: game})
            return
        }
    }
}