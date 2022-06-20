import { Component } from "atv-legacy.js/dist/component";
import CategoryLayoutItemTemplate from '!!raw-loader!./category-layout-item.xml';
import Q from "atv-legacy-q";

export class CategoryLayoutItemComponent extends Component {
    protected loadTemplateSource(): any {
        const promise = Q.defer<string>();
        promise.resolve(CategoryLayoutItemTemplate);
        return promise.promise;
    }

    constructor() {
        super('categoryLayoutItem');
    }
}