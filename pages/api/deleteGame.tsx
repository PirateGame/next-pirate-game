import type {NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

async function deleteGame(gameName: string){
    await prisma.game.delete({
        where: {
            name: gameName,
        }
    })
}

async function deletePlayer(id: number){
    await prisma.player.delete({
        where: {
            id: id
        }
    })
}

async function getPlayerlist(gameName: string) {
    var result = await prisma.player.findMany({
        where: {
            gameName: gameName,
        },
        select: {
            name: true,
        }
    })
    var out = []
    for(var i=0; i < result.length; i ++) {
        out.push(result[i].name)
    }
    return out
}

async function getGame(gameName: string){
    var result = await prisma.game.findUnique({
        where: {
            name: gameName,
        }
    })
    return result
}


async function getPlayer(gameName: string, playerName: string){
    var result = await prisma.player.findFirst({
        where: {
            gameName: gameName,
            name: playerName
        },
        select: {
            id: true
        }
    })
    return result
}


const main = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        var gameName = req.body.gameName
        var exists = await getGame(gameName)

        if (exists == null) {
            res.status(500).json({error: true, message: "game not found"})
            return
        }
        var playerList = await getPlayerlist(gameName)
        for (var i in playerList) {
            var result = await getPlayer(gameName, playerList[i])
            if (result == undefined) {
                return
            } else {
                var id = result.id
            }
            await deletePlayer(id)
        }
        await deleteGame(gameName)
        res.status(200).json({error: false})
    }
}

export default main