import { Page } from "atv-legacy.js/dist/page";
import ProfileDeleteTemplate from '!!raw-loader!./profile-delete.xml';
import Q from "atv-legacy-q";

export class ProfileDelete extends Page {
    constructor(private profileId: string) {
        super();
    }
    
    protected loadData(): Q.Promise<any> {
        const deferred = Q.defer<string>();
        deferred.resolve(this.profileId);

        return deferred.promise;
    }

    protected loadTemplateSource(): Q.Promise<string> {
        const deferred = Q.defer<string>();
        deferred.resolve(ProfileDeleteTemplate);

        return deferred.promise;
    }

}