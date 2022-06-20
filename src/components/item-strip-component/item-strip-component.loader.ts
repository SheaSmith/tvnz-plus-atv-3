import { Component } from "atv-legacy.js/dist/component";
import ItemStripComponentTemplate from '!!raw-loader!./item-strip-component.xml';
import Q from "atv-legacy-q";

export class ItemStripComponent extends Component {
    protected loadTemplateSource(): any {
        const promise = Q.defer<string>();
        promise.resolve(ItemStripComponentTemplate);
        return promise.promise;
    }

    constructor() {
        super('itemStrip');
    }
}