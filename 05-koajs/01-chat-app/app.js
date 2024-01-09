const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let subscribers = [];

router.get('/subscribe', async (ctx, next) => {
    const message = await new Promise((resolve) => {
        subscribers.push(resolve);
    });
    ctx.status = 200;
    ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
    const message = ctx.request.body?.message;
    if (!message) {
        ctx.status = 400;
        return;
    }
    for (const resolve of subscribers){
        resolve(message);
    };
    subscribers = []; // Очистка массива

    ctx.status = 200;
});

app.use(router.routes());

module.exports = app;
