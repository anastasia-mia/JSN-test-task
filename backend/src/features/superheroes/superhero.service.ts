import {CreateSuperheroDto, UpdateSuperheroDto} from "./superhero.dto";
import {prisma} from "../../config/db";
import {stripUndefined} from "../../shared/utils/strip-undefined";

const uniqueSuperpowers = (data: string[]):string[] => {
    return Array.from(new Set(
        data.map((power:string) => power.trim()).filter(Boolean)
    ));
}

export const create = async(superheroData: CreateSuperheroDto) => {
    const normalizedSuperpowers: string[] = uniqueSuperpowers(superheroData.superpowers)

    const newSuperhero = await prisma.superhero.create({
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

export const findById = async(id:number) => {
    return await prisma.superhero.findUnique({where: {id}});
}

export const update = async(id: number, newSuperheroData: UpdateSuperheroDto) => {
    const dataToUpdate: UpdateSuperheroDto = { ...newSuperheroData };

    if(dataToUpdate.superpowers){
        dataToUpdate.superpowers = uniqueSuperpowers(dataToUpdate.superpowers)
    }

    const cleanData= stripUndefined(dataToUpdate);

    const updatedSuperhero = await prisma.superhero.update({
        where: {id},
        data: cleanData
    });

    return updatedSuperhero;
}

export const remove = async (id: number) => {
    await prisma.superhero.delete({where: {id}});
}