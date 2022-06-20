import { Component } from "atv-legacy.js/dist/component";
import HomeComponentTemplate from '!!raw-loader!./home-component.xml';
import Q from "atv-legacy-q";

export class HomeComponent extends Component {
    protected loadTemplateSource(): any {
        const promise = Q.defer<string>();
        promise.resolve(HomeComponentTemplate);
        return promise.promise;
    }

    constructor() {
        super('BigScreenHomepageV3Layout');
    }
}