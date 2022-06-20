import { Page } from "atv-legacy.js/dist/page";
import SearchPageTemplate from '!!raw-loader!./search.xml';
import Q from "atv-legacy-q";

export class SearchPage extends Page {
    constructor() {
        super();
    }

    protected loadData(): Q.Promise<any> {
        const deferred = Q.defer<any>();
        deferred.resolve();

        return deferred.promise;
    }

    protected loadTemplateSource(): Q.Promise<string> {
        const deferred = Q.defer<string>();
        deferred.resolve(SearchPageTemplate);

        return deferred.promise;
    }

}