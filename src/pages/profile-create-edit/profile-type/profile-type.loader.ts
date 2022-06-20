import { Page } from "atv-legacy.js/dist/page";
import ProfileTypeTemplate from '!!raw-loader!./profile-type.xml';
import Q from "atv-legacy-q";
import {Profile} from "../profile";

export class ProfileType extends Page {
    constructor(private profile: Profile, private returnToEdit: boolean) {
        super();
    }

    protected loadData(): Q.Promise<object> {
        const deferred = Q.defer<object>();
        const body = { returnToEdit: this.returnToEdit, profile: this.profile }
        deferred.resolve(body);

        return deferred.promise;
    }

    protected loadTemplateSource(): Q.Promise<string> {
        const deferred = Q.defer<string>();
        deferred.resolve(ProfileTypeTemplate);

        return deferred.promise;
    }

}