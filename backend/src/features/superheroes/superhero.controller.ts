import {Request, Response, NextFunction} from "express";
import {CreateSuperheroDto} from "./superhero.dto";
import {ApiError} from "../../shared/errors/api-error";
import * as superheroService from "./superhero.service";

export const create = async(req: Request, res: Response, next: NextFunction) => {
    const superheroData: CreateSuperheroDto = req.body;

    if(!superheroData) ApiError.badRequest()

    const createdSuperhero = await superheroService.create(superheroData)
    res.status(201).json(createdSuperhero)
}