const { mongoose } = require('../../../../src/db');

before(mongoose.connect);
after(mongoose.disconnect);
