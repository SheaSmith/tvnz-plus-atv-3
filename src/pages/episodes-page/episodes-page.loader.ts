import { Page } from "atv-legacy.js/dist/page";
import EpisodesPageTemplate from '!!raw-loader!./episodes-page.xml';
import Q from "atv-legacy-q";
import {registerHelpers} from "../../custom-handlebars-helpers";
import {AuthInterceptor} from "../../auth-interceptor";
import {Environment} from "nunjucks";
import {HttpService} from "atv-legacy.js/dist/http-service";

export class EpisodesPage extends Page {
    constructor(private showId: string) {
        super();
    }

    protected loadData(): Q.Promise<any> {
        return new HttpService("https://apis-public-prod.tech.tvnz.co.nz/play/v1/graphql", "POST")
            .header("Content-Type", "application/json")
            .interceptor(new AuthInterceptor())
            .body(`{ "query": "query { show (id: ${this.showId}) { title videoCollections { label videos { id badge primaryLabel secondaryLabel captions synopsis image rating { classification advisoryWarnings } duration { total watched complete } } } } } " }`)
            .run();
    }

    protected loadTemplateSource(): Q.Promise<string> {
        const deferred = Q.defer<string>();
        deferred.resolve(EpisodesPageTemplate);

        return deferred.promise;
    }

    protected registerCustomHelpers(environment: Environment) {
        registerHelpers(environment);
    }

}
