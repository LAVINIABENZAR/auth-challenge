import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

const jwtSecret = 'mysecret';

const getAllMovies = async (req, res) => {
    const movies = await prisma.movie.findMany();
    res.json({ data: movies });
};

const createMovie = async (req, res) => {
    const { title, description, runtimeMins } = req.body;

    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            res.status(401).json({ error: 'Missing Token' })
        }

        jwt.verify(token, jwtSecret, async (error) => {
            if (error) {
                return res.status(401).json({ error: 'Unauthenticated token' })
            }

            const createdMovie = await prisma.movie.create({
                data: {
                    title,
                    description,
                    runtimeMins
                }
            })
            res.status(201).json({ data: createdMovie });
        });
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token provided.' })
    }




};

export {
    getAllMovies,
    createMovie
};
