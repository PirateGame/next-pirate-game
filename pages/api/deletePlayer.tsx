import type {NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

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

async function deletePlayer(id:number){
    var result = await prisma.player.delete({
        where: {
            id:id
        }
    })
    return result
}


const main = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        var gameName = req.body.gameName
        var playerName = req.body.playerName
        var result = await getPlayer(gameName, playerName)
        if (result == undefined) {
            return
        } else {
            var id = result.id
        }
        await deletePlayer(id)
        res.status(200).json({error: false})
    }
}

export default main