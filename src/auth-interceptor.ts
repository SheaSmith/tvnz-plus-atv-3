import {HttpService, Interceptor} from "atv-legacy.js/dist/http-service";
import Q from "atv-legacy-q";

export class AuthInterceptor implements Interceptor {
    aboutToRequest(service: HttpService): Q.Promise<HttpService> {
        const headers: { [key: string]: string } = {
            "Authorization": 'Bearer ' + atv.localStorage['accessToken'] as string,
            'x-tvnz-api-client-id': 'tizen/4.48.0',
            'Accept': 'application/json,x-tvnz-play-page-api;version=v4'
        };

        if (atv.sessionStorage.getItem('profileId') != null) {
            headers['x-tvnz-active-profile-id'] = atv.sessionStorage.getItem('profileId') as string;
        }

        const deferred = Q.defer<HttpService>();
        deferred.resolve(service.headers(headers));
        return deferred.promise;
    }
}