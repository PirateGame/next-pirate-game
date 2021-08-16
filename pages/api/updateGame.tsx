import type {NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

async function updateGame(gameName: string){
    var result = await prisma.game.update({
        where: {
            name: gameName,
        },
        data: {

        }
    })
    return result
}


export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        var gameName = req.body.gameName
    }
}