import { Page } from "atv-legacy.js/dist/page";
import ProfileEditTemplate from '!!raw-loader!./profile-edit.xml';
import Q from "atv-legacy-q";
import {Profile} from "../profile";
import {HttpService} from "../../../../../../Users/Shea/Documents/Apple TV Framework/library/dist/http-service";
import {AuthInterceptor} from "../../../auth-interceptor";

export class ProfileEdit extends Page {
    constructor(private profileId: string) {
        super();
    }
    
    protected loadData(): Q.Promise<any> {
        return new HttpService("https://apis-public-prod.tech.tvnz.co.nz/api/v1/stv/consumer/account", "GET")
            .interceptor(new AuthInterceptor())
            .pipe((body) => {
                const newBody = JSON.parse(JSON.stringify(body));
                newBody.profileId = this.profileId;
                return newBody;
            })
            .run();
    }

    protected loadTemplateSource(): Q.Promise<string> {
        const deferred = Q.defer<string>();
        deferred.resolve(ProfileEditTemplate);

        return deferred.promise;
    }

}