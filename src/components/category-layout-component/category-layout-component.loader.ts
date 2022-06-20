import { Component } from "atv-legacy.js/dist/component";
import CategoryLayoutComponentTemplate from '!!raw-loader!./category-layout-component.xml';
import Q from "atv-legacy-q";

export class CategoryLayoutComponent extends Component {
    protected loadTemplateSource(): any {
        const promise = Q.defer<string>();
        promise.resolve(CategoryLayoutComponentTemplate);
        return promise.promise;
    }

    constructor() {
        super('categoryLayout');
    }
}