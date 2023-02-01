
const createSQLQuery = require('./createSqlQuery');



const permission = async (req, res, next) => {


    const { userId } = req.cookies;

    if (!req.cookies.userId) {
        res.send(false);
        return;
    }
    console.log('cookie: ', req.cookies.userId);
    const data = await createSQLQuery.sqlSelect({
        distinct: false,
        columns: ['user_access.permission'],
        tableName: "user_access",
        where: `user_access.user_id = '${req.cookies.userId}'`,
        orderBy: [],
        join: []
    });
    res.locals.permission = data[0].permission;
    next();
};

module.exports = permission;