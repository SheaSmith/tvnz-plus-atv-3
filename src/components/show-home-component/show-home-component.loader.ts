import { Component } from "atv-legacy.js/dist/component";
import ShowHomeComponentTemplate from '!!raw-loader!./show-home-component.xml';
import Q from "atv-legacy-q";

export class ShowHomeComponent extends Component {
    protected loadTemplateSource(): any {
        const promise = Q.defer<string>();
        promise.resolve(ShowHomeComponentTemplate);
        return promise.promise;
    }

    constructor() {
        super('bigScreenShowHomeLayout');
    }
}