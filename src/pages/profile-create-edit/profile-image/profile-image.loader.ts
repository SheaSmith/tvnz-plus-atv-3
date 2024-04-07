import { Page } from "atv-legacy.js/dist/page";
import ProfileImageTemplate from '!!raw-loader!./profile-image.xml';
import Q from "atv-legacy-q";
import {Profile} from "../profile";
import {AuthInterceptor} from "../../../auth-interceptor";
import {HttpService} from "atv-legacy.js/dist/http-service";

export class ProfileImage extends Page {
    constructor(private profile: Profile) {
        super();
    }
    
    protected loadData(): Q.Promise<any> {
        return new HttpService("https://apis-public-prod.tech.tvnz.co.nz/api/v1/stv/consumer/profile-icons", "GET")
            .interceptor(new AuthInterceptor())
            .pipe((body) => {
                const newBody = JSON.parse(JSON.stringify(body));
                newBody.profile = this.profile;
                return newBody;
            })
            .run()
    }

    protected loadTemplateSource(): Q.Promise<string> {
        const deferred = Q.defer<string>();
        deferred.resolve(ProfileImageTemplate);

        return deferred.promise;
    }

}
