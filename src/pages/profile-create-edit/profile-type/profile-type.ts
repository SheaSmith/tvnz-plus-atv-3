import {applyContentRestriction, showName, showNameEntry, showYearOfBirth} from "../profile-info-entry";
import {Profile} from "../profile";
import {ProfileKidsPg} from "../profile-kids-pg/profile-kids-pg.loader";
import {ProfileGender} from "../profile-gender/profile-gender.loader";

export function select(id: string, returnToEdit: boolean, profile: Profile) {
    if (id == 'preteen') {
        new ProfileKidsPg(profile, returnToEdit).loadPage(undefined, false, true);
    } else {
        applyContentRestriction(id, profile, returnToEdit);
    }
}