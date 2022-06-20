import {MainMenu} from "../main-menu/main-menu.loader";
import {ProfilePage} from "./profile-page.loader";
import {ProfileEdit} from "../profile-create-edit/profile-edit/profile-edit.loader";
import {ProfileType} from "../profile-create-edit/profile-type/profile-type.loader";
import {Profile} from "../profile-create-edit/profile";

export function loadProfile(id: string) {
    atv.sessionStorage.setItem('profileId', id);
    new MainMenu().loadPage()
}

export function logout() {
    atv.logout();
}

export function volatileReload() {
    new ProfilePage().loadPage(undefined, false, true);
}

export function editProfile(id: string) {
    new ProfileEdit(id).loadPage();
}

export function addProfile() {
    new ProfileType(new Profile(), false).loadPage();
}