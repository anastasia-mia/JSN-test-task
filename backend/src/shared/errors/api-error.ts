export class ApiError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string){
        super(message)
        this.statusCode = statusCode
    }

    static notFound(message = 'Not fuond'){
        return new ApiError(404, message)
    }

    static badRequest(message = 'Bad request'){
        return new ApiError(400, message)
    }
}