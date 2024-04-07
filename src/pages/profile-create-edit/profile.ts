import {AuthInterceptor} from "../../auth-interceptor";
import Q from 'atv-legacy-q';
import {HttpService} from "atv-legacy.js/dist/http-service";

export class Profile {
    id: string | undefined;
    contentRestriction: string = "none";
    firstName = '';
    gender: string = 'diverse';
    iconId: string | undefined;
    yearOfBirth: number | undefined;
}

export function saveProfile(profile: Profile): Q.Promise<any> {
    return new HttpService(`https://apis-public-prod.tech.tvnz.co.nz/api/v1/stv/consumer/account/profile${profile.id ? '/' + profile.id : ''}`, "POST")
        .header("Content-Type", "application/json")
        .interceptor(new AuthInterceptor())
        .body(JSON.stringify({
            contentRestriction: profile.contentRestriction,
            firstName: profile.firstName,
            gender: profile.gender,
            iconId: profile.iconId,
            lastName: '',
            yearOfBirth: profile.yearOfBirth
        }))
        .run()
}
