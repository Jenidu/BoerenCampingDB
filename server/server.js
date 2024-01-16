const express = require('express');
const bodyParser = require('body-parser');
const customersRouter = require('./Routes/customers');
const bookingsRouter = require('./Routes/bookings');
const campingSpotsRouter = require('./Routes/campingspots');
const activityTypesRouter = require('./Routes/activitytypes');
const activitiesRouter = require('./Routes/activities');
const activitySignupsRouter = require('./Routes/activitysignups');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());  // Middleware to parse JSON requests
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST,DELETE,PATCH',
  credentials: true,
}));

app.use('/customers', customersRouter);
app.use('/bookings', bookingsRouter);
app.use('/campingSpots', campingSpotsRouter);
app.use('/activityTypes', activityTypesRouter);
app.use('/activities', activitiesRouter);
app.use('/activitySignups', activitySignupsRouter);

app.listen(port, () => {  // Start the server
  console.log(`Server is listening on port ${port}`);
});
