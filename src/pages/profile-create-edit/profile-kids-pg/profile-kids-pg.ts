import {applyContentRestriction, showName, showNameEntry, showYearOfBirth} from "../profile-info-entry";
import {Profile} from "../profile";

export function select(id: string, returnToEdit: boolean, profile: Profile) {
    applyContentRestriction(id, profile, returnToEdit);
}