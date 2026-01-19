import {Request, Response, NextFunction} from "express";
import {
    CreateSuperheroDto,
    CreateSuperheroSchema,
    ListSuperheroesQueryDto, ListSuperheroesQuerySchema,
    UpdateSuperheroDto,
    UpdateSuperheroSchema
} from "./superhero.dto";
import { ZodError } from "zod";
import {ApiError} from "../../shared/errors/api-error";
import * as superheroService from "./superhero.service";

function handleZodOrPass(err: unknown, next: NextFunction) {
    if (err instanceof ZodError) {
        return next(ApiError.badRequest(err.errors.map((e) => e.message).join(", ")));
    }
    return next(err as Error);
}

export const create = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const superheroData: CreateSuperheroDto = CreateSuperheroSchema.parse(req.body);
        const createdSuperhero = await superheroService.create(superheroData)
        res.status(201).json(createdSuperhero)
    }catch(err){
        return handleZodOrPass(err, next)
    }
}

export const getById = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const heroId = Number(req.params.id);
        if (Number.isNaN(heroId)){
            throw ApiError.badRequest('Id is not a number');
        }

        const superhero = await superheroService.getById(heroId);
        res.status(200).json(superhero);
    }catch(err){
        return handleZodOrPass(err, next)
    }
}

export const update = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const heroId = Number(req.params.id);
        if (Number.isNaN(heroId)){
            throw ApiError.badRequest('Id is not a number');
        }

        const updatedSuperheroData: UpdateSuperheroDto = UpdateSuperheroSchema.parse(req.body);
        if(Object.keys(updatedSuperheroData).length === 0) {
            throw ApiError.badRequest('Body must not be empty');
        }

        const updatedSuperhero = await superheroService.update(heroId, updatedSuperheroData)
        res.status(200).json(updatedSuperhero)
    }catch(err){
        return handleZodOrPass(err, next)
    }
}

export const remove = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const heroId = Number(req.params.id);
        if (Number.isNaN(heroId)){
            throw ApiError.badRequest('Id is not a number');
        }

        await superheroService.remove(heroId);
        res.status(204).send();
    }catch(err) {
        return handleZodOrPass(err, next)
    }
}

export const getList = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const {page, limit}: ListSuperheroesQueryDto = ListSuperheroesQuerySchema.parse(req.query);

        const superheroList = await superheroService.list(page, limit);
        return res.status(200).json(superheroList)
    }catch(err) {
        return handleZodOrPass(err, next)
    }
}