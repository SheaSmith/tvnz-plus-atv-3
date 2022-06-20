import {Profile, saveProfile} from "../profile";
import {showGender, showName, showYearOfBirth} from "../profile-info-entry";
import {ProfileType} from "../profile-type/profile-type.loader";
import {ProfileImage} from "../profile-image/profile-image.loader";
import {ProfileEdit} from "./profile-edit.loader";
import {ProfileDelete} from "../profile-delete/profile-delete.loader";

export function editName(originalProfile: any) {
    const profile = profileToClass(originalProfile);
    showName((name) => {
        profile.firstName = name;
        saveProfile(profile);
        document.getElementById("profileName").getElementByName("rightLabel").textContent = name;
    });
}

export function editYearOfBirth(originalProfile: any) {
    const profile = profileToClass(originalProfile);
    showYearOfBirth((year) => {
        profile.yearOfBirth = parseInt(year);
        saveProfile(profile);
        document.getElementById("yearOfBirth").getElementByName("rightLabel").textContent = year;
    }, undefined, profile.yearOfBirth?.toString());
}

export function editGender(originalProfile: any) {
    const profile = profileToClass(originalProfile);
    showGender(profile, true);
}

export function editRestrictions(originalProfile: any) {
    const profile = profileToClass(originalProfile);
    new ProfileType(profile, true).loadPage();
}

export function editImage(originalProfile: any) {
    const profile = profileToClass(originalProfile);
    new ProfileImage(profile).loadPage();
}

export function reload(profileId: string) {
    new ProfileEdit(profileId).loadPage(undefined, false, true);
}

export function deleteProfile(profileId: string) {
    new ProfileDelete(profileId).loadPage(undefined, false, true);
}

function profileToClass(originalProfile: any): Profile {
    const profile = new Profile();
    profile.firstName = originalProfile.firstName;
    profile.id = originalProfile.id;
    profile.gender = originalProfile.gender;
    profile.yearOfBirth = originalProfile.yearOfBirth;
    profile.contentRestriction = originalProfile.contentRestriction;
    profile.iconId = originalProfile.iconId;

    return profile;
}