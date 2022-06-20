import { Component } from "atv-legacy.js/dist/component";
import BandedSlotLayoutComponentTemplate from '!!raw-loader!./banded-slot-layout-component.xml';
import Q from "atv-legacy-q";

export class BandedSlotLayoutComponent extends Component {
    protected loadTemplateSource(): any {
        const promise = Q.defer<string>();
        promise.resolve(BandedSlotLayoutComponentTemplate);
        return promise.promise;
    }

    constructor() {
        super('bandedSlotLayout');
    }
}