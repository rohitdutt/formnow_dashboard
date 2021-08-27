const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const authMiddleware = require("./src/middlewares/authMiddleware");
const {dashboardData} = require("./src/dashboardData");

const port = 3004;
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("*" , authMiddleware);

app.post('/api/v1/get-dashboard-data', dashboardData);

app.listen(process.env.PORT || port, () => {
    console.log(`app listening at http://localhost:${port}`)
});