import {Page} from "atv-legacy.js/dist/page";
import Q from "atv-legacy-q";
import SportsViewerTemplate from '!!raw-loader!./sports-viewer.xml';

export class SportsViewer extends Page {
    constructor(private streamData: any, private emb: any) {
        super();
    }

    protected loadData(): Q.Promise<any> {
        const deferred = Q.defer<any>();
        deferred.resolve({ streamData: this.streamData, emb: this.emb });

        return deferred.promise;
    }

    protected loadTemplateSource(): Q.Promise<string> {
        const deferred = Q.defer<string>();
        deferred.resolve(SportsViewerTemplate);

        return deferred.promise;
    }

}
