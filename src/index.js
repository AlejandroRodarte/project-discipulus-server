const app = require('./app');
const db = require('./db');

const port = +process.env.PORT || 3000;

db.mongoose.connect();

app.listen(port, () => console.log(`Discipulus server mounted on port ${port}`));
