import * as express from 'express';
import * as path from 'path';
import * as http from 'http';
import * as cors from 'cors';
import { MongoClient } from 'mongodb';
import { Request, Response } from 'express';
import * as compression from "compression";

const app = express();
const server = http.createServer(app);
const router = express.Router();

const uri = "mongodb+srv://devadmin:devadmin@learningcluster-ijumw.mongodb.net/admin";
const client = new MongoClient(uri, { useNewUrlParser: true });

// Apply the routes to our application with the prefix /api
// Options for cors midddleware
const options: cors.CorsOptions = {
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: '*',
  preflightContinue: true,
  optionsSuccessStatus: 200
};

// Use cors middleware
router.use(cors(options));
router.options('*', cors(options));

const port = process.env.PORT || 3000;
app.set('port', port);

app.use('/', express.static(path.join(__dirname, '../client')));
app.use(express.json());
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(cors(options));
app.use('/api', router);

app.get('*', (request: Request, response: Response) => {
  response.sendFile(path.join(__dirname, '../client/index.html'));
});

server.listen(app.get('port'), () => {
  console.log(`Server started on port ${server.address().port} :)`);
});

router.get('/', (request: Request, response: Response) => {
  response.send('budget api works');
});

router.get('/users', (request: Request, response: Response) => {
  client.connect(error => {
    if (error) throw error;
    var query = { 'type': 'user' };
    client.db("budget").collection('diary').find(query).toArray(function (err, result) {
      if (err) throw err;
      response.send(result);
      //  client.close();
    });
  });
});

router.get('/services', (request: Request, response: Response) => {
  client.connect(error => {
    if (error) throw error;
    var query = { 'type': 'service' };
    client.db("budget").collection('diary').find(query).toArray(function (err, result) {
      if (err) throw err;
      response.send(result);
      //  client.close();
    });
  });
});

router.get('/budgets', (request: Request, response: Response) => {
  client.connect(error => {
    if (error) throw error;
    // perform actions on the collection object
    client.db("budget").collection('payments').find().toArray(function (err, result) {
      if (err) throw err;
      response.send(result);
      //  client.close();
    });
  });
});

router.post("/add", (request: Request, response: Response) => {
  // save the payments in store and check for errors
  client.connect(error => {
    if (error) throw error;
    // perform actions on the collection object
    client.db("budget").collection('payments').insertOne(request.body)
      .then(function (result) {
        response.send(result);
      })
  });
});

export { app };
