import app from './app';
import {env} from './config/env';

const server = app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`)
});

function shutdown(signal: string) {
    console.log(`${signal} received. Closing server...`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

