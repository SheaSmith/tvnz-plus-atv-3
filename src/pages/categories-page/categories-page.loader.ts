import { Page } from "atv-legacy.js/dist/page";
import CategoriesPageTemplate from '!!raw-loader!./categories-page.xml';
import Q from "atv-legacy-q";
import {HttpService} from "atv-legacy.js/dist/http-service";
import {AuthInterceptor} from "../../auth-interceptor";
import {registerHelpers} from "../../custom-handlebars-helpers";
import Handlebars from "handlebars";

export class CategoriesPage extends Page {
    protected loadTemplateSource(): Q.Promise<string> {
        const deferred = Q.defer<string>();
        deferred.resolve(CategoriesPageTemplate);

        return deferred.promise;
    }


    protected renderXml(data?: any) {
        super.renderXml(data);
    }

    constructor(private url: string) {
        super();
    }

    protected loadData(): Q.Promise<any> {
        return new HttpService(`https://apis-edge-prod.tech.tvnz.co.nz${this.url}`, "GET")
            .interceptor(new AuthInterceptor())
            .run<any>();
    }

    protected registerCustomHelpers(handlebars: typeof Handlebars) {
        registerHelpers(handlebars);
    }
}