const Koa = require("koa");
const Router = require("koa-router");
const BodyParser = require("koa-bodyparser");
const Logger = require('koa-logger');
const Mongo = require('koa-mongo');
const ObjectID = require("mongodb").ObjectID;

const app = new Koa();
const router = new Router();

app.use(Mongo());
app.use(BodyParser());
app.use(Logger());

app.context.user = 'AnshulG8'
router.get("/test", ctx => (ctx.body = `Hello ${ctx.user}`))
router.get("/test/:name", ctx => (ctx.body = `Hello ${ctx.params.name}`)) // fetching query params
router.post("/test", ctx => (ctx.body = `Hello ${ctx.request.body.name}`)) // fetching post body data

// List all people
router.get("/people", async (ctx) => {
  console.log("ctx ", ctx.mongo.db('koala').collection('people'));
    ctx.body = await ctx.mongo.db('koala').collection('people').find().toArray();
});

// Get one
router.get("/people/:id", async (ctx) => {
    ctx.body = await ctx.mongo.db('koala').collection('people').findOne({"_id": ObjectID(ctx.params.id)});
});

// Create new person
router.post("/people", async (ctx) => {
    ctx.body = await ctx.mongo.db('koala').collection('people').insert(ctx.request.body);
});

// Update one
router.put("/people/:id", async (ctx) => {
    let documentQuery = {"_id": ObjectID(ctx.params.id)}; // Used to find the document
    let valuesToUpdate = { $set: ctx.request.body };
    ctx.body = await ctx.mongo.db('koala').collection('people').updateOne(documentQuery, valuesToUpdate);
});

// Delete one
router.delete("/people/:id", async (ctx) => {
    let documentQuery = {"_id": ObjectID(ctx.params.id)}; // Used to find the document
    ctx.body = await ctx.mongo.db('koala').collection('people').deleteOne(documentQuery);
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(3000);
