const { error } = require('console');
const fs = require('fs');
const con = require('./connection.js');

const sqlActions = {
    createTableFromJson: (filePath) => {
        fs.readFile(filePath, (err, data) => {
            if (err) throw err;
            let tableData = JSON.parse(data);
            let tableName = tableData.table_name;
            let fields = tableData.fields;
            let sqlQuery = `CREATE TABLE ${tableName} (`;

            fields.forEach(field => {
                let fieldName = field.name;
                let fieldType = field.type;
                let primaryKey = field.primary_key;
                let autoIncrement = field.auto_increment;
                sqlQuery += `${fieldName} ${fieldType}`;
                if (primaryKey) {
                    sqlQuery += " PRIMARY KEY";
                }
                if (autoIncrement) {
                    sqlQuery += " AUTO_INCREMENT";
                }
                if (unique) {
                    sqlQuery += " UNIQUE";
                }
                if (notNull) {
                    sqlQuery += " NOT NULL";
                }
                sqlQuery += ",";
            });

            sqlQuery = sqlQuery.slice(0, -1);
            sqlQuery += ")";
            console.log(sqlQuery);
            con.query(sqlQuery, (err, result) => {
                resultCheck(result, err);
            });
        });
    },
    insertIntoTable: (tableName, fieldNames, values) => {
        let sqlQuery = `INSERT INTO ${tableName} (`;

        fieldNames.forEach(fieldName => {
            sqlQuery += `${fieldName},`;
        });

        sqlQuery = sqlQuery.slice(0, -1);
        sqlQuery += ") VALUES (";

        values.forEach(value => {
            sqlQuery += `'${value}',`;
        });

        sqlQuery = sqlQuery.slice(0, -1);
        sqlQuery += ")";

        console.log(sqlQuery);
        con.query(sqlQuery, (err, result) => {
            resultCheck(result, err);
        });
    },
    sqlSelect: async (values, res) => {
        let sqlQuery = `SELECT ${values.distinct ? 'DISTINCT' : ''} ${values.columns.join(', ')} FROM ${values.tableName}`;
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

        console.log('sqlquery: ', sqlQuery);
        let dataCheck;
        const queryPromise = new Promise((resolve, reject) => {
            const dbQuery = con.query(sqlQuery, (err, result) => {
                dataCheck = resultCheck(result, err);
                if (err) {
                    reject(err);
                } else {
                    resolve(dataCheck);
                }
            });
        });
        const result = await queryPromise;
        console.log('result: ', result);
        return result;
    },
    updateTable: async (tableName, fieldNames, values, conditions) => {
        let sqlQuery = `UPDATE ${tableName} SET `;

        for (let i = 0; i < fieldNames.length; i++) {
            sqlQuery += `${fieldNames[i]} = '${values[i]}',`;
        }

        sqlQuery = sqlQuery.slice(0, -1);
        sqlQuery += " WHERE ";

        conditions.forEach(condition => {
            sqlQuery += `${condition} AND `;
        });

        sqlQuery = sqlQuery.slice(0, -4);


        con.query(sqlQuery, (err, result) => {
            resultCheck(result, err);
        });
    },

};

const resultCheck = (result, err) => {
    if (err) return err;
    console.log('inner result', result);
    return result;
};


module.exports = sqlActions;