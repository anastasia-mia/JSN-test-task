import {CreateSuperheroDto} from "./superhero.dto";
import {prisma} from "../../config/db";

export const create = (superheroData: CreateSuperheroDto) => {
    const normalizedSuperpowers: string[] = Array.from(new Set(
        superheroData.superpowers.map((power:string) => power.trim()).filter(Boolean)
    ));

    const newSuperhero = prisma.superhero.create({
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