"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var url = require("url");
var apollo_server_core_1 = require("apollo-server-core");
var GraphiQL = require("apollo-server-module-graphiql");
function graphqlExpress(options) {
    if (!options) {
        throw new Error('Apollo Server requires options.');
    }
    if (arguments.length > 1) {
        throw new Error("Apollo Server expects exactly one argument, got " + arguments.length);
    }
    return function (req, res, next) {
        apollo_server_core_1.runHttpQuery([req, res], {
            method: req.method,
            options: options,
            query: req.method === 'POST' ? req.body : req.query,
        }).then(function (gqlResponse) {
            if (JSON.stringify(req.body).indexOf("IntrospectionQuery") > -1) {
                res.setHeader('Content-Type', 'application/json');
                res.write(gqlResponse);
                res.end();
            }
        }, function (error) {
            if ('HttpQueryError' !== error.name) {
                return next(error);
            }
            if (error.headers) {
                Object.keys(error.headers).forEach(function (header) {
                    res.setHeader(header, error.headers[header]);
                });
            }
            res.statusCode = error.statusCode;
            res.write(error.message);
            res.end();
        });
    };
}
exports.graphqlExpress = graphqlExpress;
function graphiqlExpress(options) {
    return function (req, res, next) {
        var query = req.url && url.parse(req.url, true).query;
        GraphiQL.resolveGraphiQLString(query, options, req).then(function (graphiqlString) {
            res.setHeader('Content-Type', 'text/html');
            res.write(graphiqlString);
            res.end();
        }, function (error) { return next(error); });
    };
}
exports.graphiqlExpress = graphiqlExpress;
//# sourceMappingURL=expressApollo.js.map