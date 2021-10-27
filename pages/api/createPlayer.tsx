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

async function getGameState(gameName: string) {
    var res: any = await prisma.game.findFirst({
        where: {
            name: gameName,
        },
        select: {
            state: true,
        }
    })
    return res.state
}

async function findUniqueName(gameName: string, playerName: string){
    var result = await prisma.player.findFirst({
        where: {
            gameName: gameName,
            name: playerName
        },
        select: {
            name: true
        }
    })
    return result
}

async function joinGame(gameName: string, playerName: string, host: boolean) {
    var result = await prisma.player.create({
        data: {
            name: playerName,
            money: 0,
            bank: 0,
            board: 0,
            shield: 0,
            mirror: 0,
            ship: -1,
            captain: -1,
            host: host,
            token: "",
            game: {
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
        var host = req.body.host

        var game = await findGame(gameName)
        if (game === null) {
            //game does not exist
            res.status(500).json({error: true, message: "Game not found"})
            return
        }
        if (  await findUniqueName(gameName, playerName) != null) {
            res.status(500).json({error: true, message: "Player with that name already connected"})
            return
        }
        if (await getGameState(gameName) == 2) {
            res.status(500).json({error: true, message: "Game has already started"})
            return
        }
        var joined = await joinGame(gameName, playerName, host)
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