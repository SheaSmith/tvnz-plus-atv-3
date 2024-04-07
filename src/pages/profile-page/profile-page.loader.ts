import { Page } from "atv-legacy.js/dist/page";
import ProfilePageTemplate from '!!raw-loader!./profile-page.xml';
import Q from "atv-legacy-q";
import {HttpService} from "atv-legacy.js/dist/http-service";
import {AuthInterceptor} from "../../auth-interceptor";
import {registerHelpers} from "../../custom-handlebars-helpers";
import {Environment} from "nunjucks";

export class ProfilePage extends Page {
    protected loadTemplateSource(): Q.Promise<string> {
        const deferred = Q.defer<string>();
        deferred.resolve(ProfilePageTemplate);

        return deferred.promise;
    }

    constructor() {
        super();
    }

    protected loadData(): Q.Promise<any> {
        return new HttpService("https://apis-public-prod.tech.tvnz.co.nz/api/v1/stv/consumer/account", "GET")
            .interceptor(new AuthInterceptor())
            .pipe((body) => {
                return {
                    'email': (atv as any).savedCredentials?.username,
                    'profiles': body['profiles']
                };
            })
            .run<any>();
    }

    protected registerCustomHelpers(environment: Environment) {
        registerHelpers(environment);
    }
}
