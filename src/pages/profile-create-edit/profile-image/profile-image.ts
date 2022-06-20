import {Profile, saveProfile} from "../profile";

export function select(id: string, profile: Profile) {
    profile.iconId = id;

    const proxyDocument = new atv.ProxyDocument();
    proxyDocument.show()
    saveProfile(profile)
        .then(() => {
            atv.unloadPage();
        })
        .finally(() => {
            proxyDocument.cancel();
        })
}