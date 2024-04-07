import { Page } from "atv-legacy.js/dist/page";
import LoginPageTemplate from '!!raw-loader!./login-page.xml';
import Q from "atv-legacy-q";
import {registerHelpers} from "../../custom-handlebars-helpers";
import {Environment} from "nunjucks";

export class LoginPage extends Page {
    protected loadTemplateSource(): Q.Promise<string> {
        const deferred = Q.defer<string>();
        deferred.resolve(LoginPageTemplate);

        return deferred.promise;
    }
    constructor() {
        super();
    }

    protected loadData(): Q.Promise<any> {
        const deferred = Q.defer<any>();
        deferred.resolve({});

        return deferred.promise;
    }

    protected registerCustomHelpers(environment: Environment) {
        registerHelpers(environment);
    }
}
