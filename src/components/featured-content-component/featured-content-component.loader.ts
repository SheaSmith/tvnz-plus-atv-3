import { Component } from "atv-legacy.js/dist/component";
import FeaturedContentComponentTemplate from '!!raw-loader!./featured-content-component.xml';
import Q from "atv-legacy-q";

export class FeaturedContentComponent extends Component {
    protected loadTemplateSource(): any {
        const promise = Q.defer<string>();
        promise.resolve(FeaturedContentComponentTemplate);
        return promise.promise;
    }

    constructor() {
        super('featuredContent');
    }
}