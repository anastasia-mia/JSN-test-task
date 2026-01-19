import {CreateSuperheroDto, UpdateSuperheroDto} from "./superhero.dto";
import {prisma} from "../../config/db";
import {stripUndefined} from "../../shared/utils/strip-undefined";
import {ApiError} from "../../shared/errors/api-error";
import {PaginatedResponse, SuperheroDetailsResponse, SuperheroListItemResponse} from "./superhero.types";
import {handlePrismaNotFound} from "../../shared/errors/prisma-errors";

const uniqueSuperpowers = (data: string[]):string[] => {
    return Array.from(new Set(
        data.map((power:string) => power.trim()).filter(Boolean)
    ));
}

export const create = async(superheroData: CreateSuperheroDto): Promise<SuperheroDetailsResponse> => {
    const normalizedSuperpowers: string[] = uniqueSuperpowers(superheroData.superpowers)

    const newSuperhero= await prisma.superhero.create({
        data: {
            nickname: superheroData.nickname,
            real_name: superheroData.real_name,
            origin_description: superheroData.origin_description,
            catch_phrase: superheroData.catch_phrase,
            superpowers: normalizedSuperpowers,
        }
    });

    return newSuperhero;
}

export const getById = async(id:number): Promise<SuperheroDetailsResponse> => {
    const hero = await prisma.superhero.findUnique({where: {id}});

    if (!hero) {
        throw ApiError.notFound("Superhero not found");
    }

    return hero;
}

export const update = async(id: number, newSuperheroData: UpdateSuperheroDto): Promise<SuperheroDetailsResponse> => {
    const dataToUpdate: UpdateSuperheroDto = { ...newSuperheroData };

    if(dataToUpdate.superpowers){
        dataToUpdate.superpowers = uniqueSuperpowers(dataToUpdate.superpowers)
    }

    const cleanData= stripUndefined(dataToUpdate);

    try{
        const updatedSuperhero = await prisma.superhero.update({
            where: {id},
            data: cleanData
        });

        return updatedSuperhero;
    }catch(err){
        handlePrismaNotFound(err, "Superhero not found!")
    }
}

export const remove = async (id: number): Promise<void> => {
    try{
        await prisma.superhero.delete({where: {id}});
    }catch(err){
        handlePrismaNotFound(err, "Superhero not found!")
    }
}

export const list = async(page: number, limit: number): Promise<PaginatedResponse<SuperheroListItemResponse>> => {
    const skip = (page - 1) * limit;

    const [total, heroes] = await prisma.$transaction([
        prisma.superhero.count(),
        prisma.superhero.findMany({
            skip,
            take: limit,
            orderBy: {id: 'asc'},
            select: {
                id: true,
                nickname: true
            }
        })
    ])

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
        items: heroes,
        page,
        limit,
        total,
        totalPages,
    };
}