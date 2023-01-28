const fs = require('fs');
const con = require('./connection.js');

// function createTableFromJson(filePath) {
//     fs.readFile(filePath, (err, data) => {
//         if (err) throw err;
//         let tableData = JSON.parse(data);
//         let tableName = tableData.table_name;
//         let fields = tableData.fields;
//         let sqlQuery = `CREATE TABLE ${tableName} (`;

//         fields.forEach(field => {
//             let fieldName = field.name;
//             let fieldType = field.type;
//             let primaryKey = field.primary_key;
//             let autoIncrement = field.auto_increment;
//             sqlQuery += `${fieldName} ${fieldType}`;
//             if (primaryKey) {
//                 sqlQuery += " PRIMARY KEY";
//             }
//             if (autoIncrement) {
//                 sqlQuery += " AUTO_INCREMENT";
//             }
//             if (unique) {
//                 sqlQuery += " UNIQUE";
//             }
//             if (notNull) {
//                 sqlQuery += " NOT NULL";
//             }
//             sqlQuery += ",";
//         });

//         sqlQuery = sqlQuery.slice(0, -1);
//         sqlQuery += ")";
//         console.log(sqlQuery);
//       return  con.query(sqlQuery, (err, result) => {
//             if (err) return err;
//             return true;
//         });
//     });
// }

// function insertIntoTable(tableName, fieldNames, values) {
//     let sqlQuery = `INSERT INTO ${tableName} (`;

//     fieldNames.forEach(fieldName => {
//         sqlQuery += `${fieldName},`;
//     });

//     sqlQuery = sqlQuery.slice(0, -1);
//     sqlQuery += ") VALUES (";

//     values.forEach(value => {
//         sqlQuery += `'${value}',`;
//     });

//     sqlQuery = sqlQuery.slice(0, -1);
//     sqlQuery += ")";

//     console.log(sqlQuery);
//   return  con.query(sqlQuery, (err, result) => {
//         if (err) return err;
//         return true;
//     });
// }

// function updateTable(tableName, fieldNames, values, conditions) {
//     let sqlQuery = `UPDATE ${tableName} SET `;

//     for (let i = 0; i < fieldNames.length; i++) {
//         sqlQuery += `${fieldNames[i]} = '${values[i]}',`;
//     }

//     sqlQuery = sqlQuery.slice(0, -1);
//     sqlQuery += " WHERE ";

//     conditions.forEach(condition => {
//         sqlQuery += `${condition} AND `;
//     });

//     sqlQuery = sqlQuery.slice(0, -4);

//     console.log(sqlQuery);
//     return con.query(sqlQuery, (err, result) => {
//         if (err) return err;
//         return true;
//     });
// }

// createTableFromJson('/home/hilma/Documents/final-project/server/table.json');


function createSQLQuery(values) {
    console.log(values.columns);
    let sqlQuery = `SELECT${values.distinct ? 'DISTINCT' : ''} ${values.columns.join(', ')} FROM ${values.tableName}`;
    if (values.join.length > 0) {
        sqlQuery += ` JOIN ${values.join.join(' JOIN ')}`;
    }
    if (values.where) {
        sqlQuery += ` WHERE ${values.where}`;
    }
    if (values.groupBy) {
        sqlQuery += ` GROUP BY ${values.groupBy}`;
    }
    if (values.having) {
        sqlQuery += ` HAVING ${values.having}`;
    }
    if (values.orderBy.length > 0) {
        sqlQuery += ` ORDER BY ${values.orderBy.join(', ')}`;
    }

    console.log(sqlQuery);
    con.query(sqlQuery, (err, result) => {
        console.log(result);
        if (err) return err;
        if (result.length > 0) {
            return true;
        } else {
            return false;
        }
    });
}


module.exports = createSQLQuery;