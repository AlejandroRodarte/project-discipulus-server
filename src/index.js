const app = require('./app');

const port = +process.env.PORT || 3000;

app.listen(port, () => console.log(`Discipulus server mounted on port ${port}`));
