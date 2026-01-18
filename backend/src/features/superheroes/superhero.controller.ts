import {Request, Response, NextFunction} from "express";
import {CreateSuperheroDto, CreateSuperheroSchema, UpdateSuperheroDto, UpdateSuperheroSchema} from "./superhero.dto";
import { ZodError } from "zod";
import {ApiError} from "../../shared/errors/api-error";
import * as superheroService from "./superhero.service";

export const create = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const superheroData: CreateSuperheroDto = CreateSuperheroSchema.parse(req.body);
        const createdSuperhero = await superheroService.create(superheroData)
        res.status(201).json(createdSuperhero)
    }catch(err){
        if (err instanceof ZodError) {
            return next(ApiError.badRequest(err.errors.map(e => e.message).join(", ")));
        }
        return next(err as Error);
    }
}

export const update = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const heroId = Number(req.params.id);
        if (Number.isNaN(heroId)){
            throw ApiError.badRequest('Id is not a number');
        }

        const updatedSuperheroData: UpdateSuperheroDto = UpdateSuperheroSchema.parse(req.body);
        if(Object.keys(updatedSuperheroData).length === 0){
            throw ApiError.badRequest('Body must not be empty');
        }

        const superhero = await superheroService.findById(heroId);
        if(!superhero){
            throw ApiError.notFound('Superhero not found')
        }

        const updatedSuperhero = await superheroService.update(heroId, updatedSuperheroData)
        res.status(200).json(updatedSuperhero)

    }catch(err){
        if (err instanceof ZodError) {
            return next(ApiError.badRequest(err.errors.map(e => e.message).join(", ")));
        }
        return next(err as Error);
    }
}

export const remove = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const heroId = Number(req.params.id);
        if (Number.isNaN(heroId)){
            throw ApiError.badRequest('Id is not a number');
        }

        const superhero = await superheroService.findById(heroId);
        if(!superhero){
            throw ApiError.notFound('Superhero not found');
        }

        await superheroService.remove(heroId);
        res.status(204).send();
    }catch(err) {
        if (err instanceof ZodError) {
            return next(ApiError.badRequest(err.errors.map(e => e.message).join(", ")));
        }
        return next(err as Error);
    }
}