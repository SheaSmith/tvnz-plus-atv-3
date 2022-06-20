import { Component } from "atv-legacy.js/dist/component";
import SnipeComponentTemplate from '!!raw-loader!./snipe-component.xml';
import Q from "atv-legacy-q";

export class SnipeComponent extends Component {
    protected loadTemplateSource(): any {
        const promise = Q.defer<string>();
        promise.resolve(SnipeComponentTemplate);
        return promise.promise;
    }

    constructor() {
        super('snipe');
    }
}