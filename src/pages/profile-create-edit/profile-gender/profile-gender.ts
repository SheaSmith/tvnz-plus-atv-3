import {Profile, saveProfile} from "../profile";
import {ProfileImage} from "../profile-image/profile-image.loader";

export function select(id: string, returnToEdit: boolean, profile: Profile) {
    profile.gender = id;

    if (returnToEdit) {
        const proxyDocument = new atv.ProxyDocument();
        proxyDocument.show()
        saveProfile(profile)
            .then(() => {
                atv.unloadPage();
            })
            .finally(() => proxyDocument.cancel())
    } else {
        new ProfileImage(profile).loadPage(undefined, false, true);
    }
}