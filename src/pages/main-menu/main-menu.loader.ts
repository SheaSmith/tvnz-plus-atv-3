import { Page } from "atv-legacy.js/dist/page";
import MainMenuTemplate from '!!raw-loader!./main-menu.xml';
import Q from "atv-legacy-q";
import {HttpService} from "atv-legacy.js/dist/http-service";
import {AuthInterceptor} from "../../auth-interceptor";
import {registerHelpers} from "../../custom-handlebars-helpers";
import Handlebars from "handlebars";

export class MainMenu extends Page {
    protected loadTemplateSource(): Q.Promise<string> {
        const deferred = Q.defer<string>();
        deferred.resolve(MainMenuTemplate);

        return deferred.promise;
    }

    constructor() {
        super();
    }

    protected loadData(): Q.Promise<any> {
        return new HttpService("https://apis-public-prod.tech.tvnz.co.nz/api/v1/stv/play/menu", "GET")
            .interceptor(new AuthInterceptor())
            .run<any>();
    }

    protected registerCustomHelpers(handlebars: typeof Handlebars) {
        registerHelpers(handlebars);
    }
}