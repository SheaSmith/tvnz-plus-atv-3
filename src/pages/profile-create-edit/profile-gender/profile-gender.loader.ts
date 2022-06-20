import { Page } from "atv-legacy.js/dist/page";
import ProfileGenderTemplate from '!!raw-loader!./profile-gender.xml';
import Q from "atv-legacy-q";
import {Profile} from "../profile";

export class ProfileGender extends Page {
    constructor(private profile: Profile, private returnToEdit: boolean) {
        super();
    }
    
    protected loadData(): Q.Promise<any> {
        const deferred = Q.defer<object>();
        deferred.resolve({ returnToEdit: this.returnToEdit, profile: this.profile });

        return deferred.promise;
    }

    protected loadTemplateSource(): Q.Promise<string> {
        const deferred = Q.defer<string>();
        deferred.resolve(ProfileGenderTemplate);

        return deferred.promise;
    }

}