import sequelize from '../models/sequelize.client.js';
import '../models/index.js';

try{
    await sequelize.sync({force:true});

    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log('Tables created successfully:', tables);

    for (const tableName of tables) {
        const tableDescription = await sequelize.getQueryInterface().describeTable(tableName);
        console.log(`Columns for table ${tableName}:`, tableDescription);
    }
} catch (error) {
    console.error('Error creating tables:', error); 
} finally {
    await sequelize.close();
}