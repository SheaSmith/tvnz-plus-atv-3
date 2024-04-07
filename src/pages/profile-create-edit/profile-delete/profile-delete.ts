import {AuthInterceptor} from "../../../auth-interceptor";
import {ProfileEdit} from "../profile-edit/profile-edit.loader";
import {HttpService} from "atv-legacy.js/dist/http-service";

export function deleteProfile(profileId: string) {
    const proxyDocument = new atv.ProxyDocument();
    proxyDocument.show()
    new HttpService(`https://apis-public-prod.tech.tvnz.co.nz/api/v1/stv/consumer/account/profile/${profileId}`, "DELETE")
        .interceptor(new AuthInterceptor())
        .run()
        .then(() => {
            atv.unloadPage();
        })
        .finally(() => {
            proxyDocument.cancel();
        });
}

export function cancel(profileId: string) {
    new ProfileEdit(profileId).loadPage(undefined, false, true);
}
