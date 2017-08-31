"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var shell = require("shelljs");
var _ = require("lodash");
var App = (function () {
    function App() {
        this.remitly_root = "~/remitly-vagrant/html";
        this.cli_root = path.join(__dirname, '..', 'src', 'cli');
        this.git_user = 'tallen94';
        this.git_remitly = 'Remitly';
        this.git_url = 'git@github.com::user/CXCoreService.git';
        this.apps = {
            'cx': {
                root: 'CXCoreService',
                vagrant: ''
            },
            'plat': {
                root: 'platform',
                vagrant: '/api'
            },
            'db': {
                root: 'vagrant-dev',
                vagrant: '/devdb'
            },
            'port': {
                root: 'portal',
                vagrant: ''
            },
            'jcom': {
                root: 'JavaCommon',
                vagrant: ''
            },
            'fund': {
                root: 'FundingService',
                vagrant: ''
            }
        };
        this.express = express();
        this.middleware();
        this.routes();
    }
    App.prototype.middleware = function () {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    };
    App.prototype.routes = function () {
        var _this = this;
        var router = express.Router();
        router.get('/', function (req, res, next) {
            res.json({
                message: 'Rcli Api'
            });
        });
        router.get('/gen_apps_file', function (req, res) {
            var string = _this.genAppsDict();
            _this.echoStringToFile('REMITLY_ROOT=' + _this.remitly_root, path.join(_this.cli_root, 'apps'), true);
            _this.echoStringToFile(string, path.join(_this.cli_root, 'apps'), false);
            res.json({ message: 'init apps' });
        });
        router.get('/init', function (req, res) {
            _this.linkCliFolder();
            _this.echoStringToFile("source ~/.rcli/commands", '~/.bash_profile', false);
            res.json({ message: 'added lines to .bash_profile' });
        });
        router.get('/clean', function (req, res) {
            _this.clean();
            res.json({ message: 'cleaned' });
        });
        this.express.use('/', router);
    };
    App.prototype.genAppsDict = function () {
        var string = 'declare -A apps\n' +
            "apps=(";
        _.each(this.apps, function (app, key) {
            string += '["' + key + '"]="' + app.root + app.vagrant + '"\n';
        });
        string += ")";
        return string;
    };
    App.prototype.linkCliFolder = function () {
        shell.exec('ln -s ' + this.cli_root + ' ~/.rcli');
    };
    App.prototype.clean = function () {
        shell.rm('-r', '~/.rcli');
        shell.exec("sed -i '' 's/source ~\\/\\.rcli\\/commands//g' ~/.bash_profile");
    };
    App.prototype.echoStringToFile = function (s, file, overwrite) {
        var echo = overwrite ? 'echo ":string" > :file' : 'echo ":string" >> :file';
        echo = echo.replace(':string', s)
            .replace(':file', file);
        shell.exec(echo);
    };
    return App;
}());
exports.default = new App().express;
//# sourceMappingURL=App.js.map