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
                let unique = field.unique;
                let notNull = field.notNull;
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
            return dataProvider(sqlQuery);
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
        return dataProvider(sqlQuery);
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
        return dataProvider(sqlQuery);
    },

    updateTable: async (tableName, joinTable, joinCondition, fieldNames, values, conditions) => {
        let sqlQuery = `UPDATE ${tableName} `;

        sqlQuery += ` JOIN ${joinTable} ON ${joinCondition}`;
        for (let i = 0; i < fieldNames.length; i++) {
            if (i === 0) { sqlQuery += ` SET `; }
            sqlQuery += `${fieldNames[i]} = '${values[i]}',`;
        }
        sqlQuery = sqlQuery.slice(0, -1);
        for (let i = 0; i < conditions.length; i++) {
            if (i === 0) {
                sqlQuery += ' WHERE';
            }
            sqlQuery += ` ${conditions[i]} AND `;

        };

        sqlQuery = sqlQuery.slice(0, -4);

        return dataProvider(sqlQuery);
    },

};

const resultCheck = (result, err) => {
    if (err) return err;
    console.log('inner result', result);
    return result;
};

const dataProvider = async (sqlQuery) => {
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
};


module.exports = sqlActions;