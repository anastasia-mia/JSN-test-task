import dotenv from "dotenv";

dotenv.config();

function getEnv(name: string): string{
    const value: string | undefined = process.env[name];

    if(!value){
        throw new Error(`Environment variable ${name} not found`);
    }

    return value;
}

export const env = {
    PORT: Number(process.env.PORT) || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
}