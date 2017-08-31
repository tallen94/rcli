import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as shell from 'shelljs';
import * as _ from 'lodash';

class App {
    public express: express.Application;

    private remitly_root: string = "~/remitly-vagrant/html";
    private cli_root: string = path.join(__dirname, '..', 'src', 'cli');
    private git_user: string = 'tallen94';
    private git_remitly: string = 'Remitly';

    private git_url: string = 'git@github.com::user/CXCoreService.git'

    private apps: any = {
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

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }

    private middleware(): void {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    private routes(): void {
        let router = express.Router();

        router.get('/', (req, res, next) => {
            res.json({
                message: 'Rcli Api'
            });
        });

        router.get('/gen_apps_file', (req, res) => {
            let string = this.genAppsDict();
            this.echoStringToFile('REMITLY_ROOT=' + this.remitly_root, path.join(this.cli_root, 'apps'), true);
            this.echoStringToFile(string, path.join(this.cli_root, 'apps'), false);

            res.json({ message: 'init apps' });
        });

        router.get('/init', (req, res) => {
            this.linkCliFolder();
            this.echoStringToFile("source ~/.rcli/commands", '~/.bash_profile', false);
            res.json({ message: 'added lines to .bash_profile' });
        });

        router.get('/clean', (req, res) => {
            this.clean();
            res.json({ message: 'cleaned' })
        });

        this.express.use('/', router);
    }

    private genAppsDict(): string {
        let string = 'declare -A apps\n' +
            "apps=(";

        _.each(this.apps, (app, key) => {
            string += '["' + key + '"]="' + app.root + app.vagrant + '"\n'
        });

        string += ")";

        return string;
    }

    private linkCliFolder() {
        shell.exec('ln -s ' + this.cli_root + ' ~/.rcli');
    }

    private clean() {
        shell.rm('-r', '~/.rcli');
        shell.exec("sed -i '' 's/source ~\\/\\.rcli\\/commands//g' ~/.bash_profile");
    }

    private echoStringToFile(s: string, file: string, overwrite: boolean): void {
        let echo = overwrite ? 'echo ":string" > :file' : 'echo ":string" >> :file';
        echo = echo.replace(':string', s)
            .replace(':file', file);

        shell.exec(echo);
    }
}

export default new App().express;