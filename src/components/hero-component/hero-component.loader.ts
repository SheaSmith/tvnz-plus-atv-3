import { Component } from "atv-legacy.js/dist/component";
import HeroComponentTemplate from '!!raw-loader!./hero-component.xml';
import Q from "atv-legacy-q";

export class HeroComponent extends Component {
    protected loadTemplateSource(): any {
        const promise = Q.defer<string>();
        promise.resolve(HeroComponentTemplate);
        return promise.promise;
    }

    constructor() {
        super('hero');
    }
}