import { Page } from "atv-legacy.js/dist/page";
import {registerHelpers} from "../../custom-handlebars-helpers";
import PlayShowTemplate from '!!raw-loader!./play-show.xml';
import Q from "atv-legacy-q";
import {HttpService} from "../../../../../Users/Shea/Documents/Apple TV Framework/library/dist/http-service";
import {AuthInterceptor} from "../../auth-interceptor";

export class PlayShow extends Page {
    constructor(private pageId: string) {
        super();
    }


    protected loadData(): Q.Promise<any> {
        return new HttpService("https://apis-public-prod.tech.tvnz.co.nz/play/v1/graphql", "POST")
            .header("Content-Type", "application/json")
            .body(JSON.stringify({ query: `query {video (id: ${this.pageId}) { id primaryLabel, synopsis, image, duration { watched total } playback { bcPayload }}}` }))
            .interceptor(new AuthInterceptor())
            .pipe((body) => {
                let newBody = JSON.parse(JSON.stringify(body));
                newBody.data.video.playback.bcPayload = JSON.parse(newBody.data.video.playback.bcPayload);
                return newBody;
            })
            .run();
    }

    protected loadTemplateSource(): Q.Promise<string> {
        const deferred = Q.defer<string>();
        deferred.resolve(PlayShowTemplate);

        return deferred.promise;
    }


    protected registerCustomHelpers(handlebars: typeof Handlebars) {
        super.registerCustomHelpers(handlebars);
        registerHelpers(handlebars);
    }
}