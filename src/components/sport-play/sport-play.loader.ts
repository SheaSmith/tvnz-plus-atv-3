import {Page} from "atv-legacy.js/dist/page";
import Q from "atv-legacy-q";
import SportPlayTemplate from '!!raw-loader!./sport-play.xml';
import {HttpService} from "atv-legacy.js/dist/http-service";
import {Component} from "atv-legacy.js/dist/component";

export class SportPlay extends Component {
    constructor() {
        super("sportVideoLayout")
    }


    protected loadTemplateSource(): Q.Promise<string> {
        const deferred = Q.defer<string>();
        deferred.resolve(SportPlayTemplate);

        return deferred.promise;
    }

}
