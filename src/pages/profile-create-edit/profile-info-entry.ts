import {Profile, saveProfile} from "./profile";
import {ProfileGender} from "./profile-gender/profile-gender.loader";

export function showName(callback: (name: string) => void, defaultValue?: string) {
    const page = new atv.TextEntry();
    page.type = 'emailAddress';
    page.title = 'Profile name';
    page.label = 'Profile name';
    page.instructions = 'Enter the name of the profile you want to add.';
    page.footnote = 'This is usually their first name.';
    page.onSubmit = callback;

    if (defaultValue) {
        page.defaultValue = defaultValue;
    }

    page.show();
}

export function showYearOfBirth(callback: (year: string) => void, cancel?: () => void, defaultValue?: string) {
    const page = new atv.PINEntry();
    page.title = 'Year of birth';
    page.prompt = 'Enter the person\'s year of birth';
    page.hideDigits = false;
    page.userEditable = true;
    page.numDigits = 4;
    page.initialPINCode = defaultValue;
    page.onCancel = cancel;
    page.onSubmit = (value) => {
        const currentYear = new Date().getFullYear();
        if (parseInt(value) < 1920 || parseInt(value) > currentYear) {
            const template = `<atv><body><dialog id="error"><title>Invalid year</title><description>Sorry, your year of birth must be between 1920 and ${currentYear}.</description></dialog></body></atv>`;
            atv.loadXML(atv.parseXML(template));
        } else {
            callback(value);
        }
    };

    page.show();
}

export function showNameEntry(profile: Profile, returnToEdit: boolean) {
    showName((name) => {
        profile.firstName = name;

        showYearOfBirth((year) => {
            profile.yearOfBirth = parseInt(year);

            showGender(profile, returnToEdit);
        }, () => {
            showNameEntry(profile, returnToEdit);
        })
    })
}

export function applyContentRestriction(id: string, profile: Profile, returnToEdit: boolean) {
    profile.contentRestriction = id;

    if (returnToEdit) {
        const proxyDocument = new atv.ProxyDocument();
        proxyDocument.show()
        saveProfile(profile)
            .then(() => {
                atv.unloadPage();
            })
            .finally(() => {
                proxyDocument.cancel();
            })
    } else {
        showNameEntry(profile, returnToEdit);
    }
}

export function showGender(profile: Profile, returnToEdit: boolean) {
    new ProfileGender(profile, returnToEdit).loadPage(undefined, false, returnToEdit);
}