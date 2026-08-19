import express from 'express';
import sequelize from './app/models/sequelize.client.js';
import './app/models/index.js';

const app  = express();
const PORT = process.env.PORT || 3000;



try {
    await sequelize.sync();
    console.log('Database synchronized successfully.');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    }); 
} catch (error) {
    console.error('Unable to synchronize the database:', error);
}
