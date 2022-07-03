import express, { json } from "express";
import bodyparser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import classRoutes from './routes/class.js'
import teacherRoutes from './routes/teacher.js'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './swagger.json' assert {type: "json"};




const username = "nandy"
const password = "Temp@1234"
const mongoDBUri = `mongodb+srv://${username}:${password}@dev-cluster.ca0cz2w.mongodb.net/time-table?retryWrites=true&w=majority`

// MongoDB
mongoose.connect(mongoDBUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
  .then((res) => console.log("Connected to DB"))
  .catch((err) => console.log(err));

const app = express();
const port = 4444;

// app.use(bodyparser._json()); // support json encoded bodies
app.use(bodyparser.urlencoded({ extended: true })); // support encoded bodies
// Setting up middlewares
app.use(cors());
app.use(json());
app.use(passport.initialize());

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocument));


// Routing
app.use("/class", classRoutes);
app.use("/teacher", teacherRoutes);
// app.use("/timetable/generate", fileRoutes);

app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});
