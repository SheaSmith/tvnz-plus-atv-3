import {Environment} from "nunjucks";

const iso8601DurationRegex = /(-)?P(?:([.,\d]+)Y)?(?:([.,\d]+)M)?(?:([.,\d]+)W)?(?:([.,\d]+)D)?T(?:([.,\d]+)H)?(?:([.,\d]+)M)?(?:([.,\d]+)S)?/;

export function registerHelpers(environment: Environment) {
    environment.addFilter("formatDuration", (duration, test) => {
        console.log('formatDuration', duration, test)
        const matches = duration.match(iso8601DurationRegex);

        const hours = matches[6];
        const minutes = matches[7];

        return formatDuration(minutes, hours);
    });

    environment.addFilter("subtractDurations", (duration1, duration2) => {
        const difference = subtractDuration(duration1, duration2).difference;

        const hours = Math.floor(difference / 60);
        const minutes = difference % 60;

        return formatDuration(minutes, hours);
    });

    environment.addFilter("subtractDurationsPercentage", (duration1, duration2) => {
        const sub = subtractDuration(duration1, duration2);

        return sub.totalMinutes1 / sub.totalMinutes2 * 100;
    })

    environment.addFilter("durationToSeconds", (duration) => {
        if (duration == null) {
            return 0;
        }

        const matches = duration.match(iso8601DurationRegex);

        if (matches != null) {
            const hours = matches[6];
            const minutes = matches[7];
            const seconds = matches[8];

            let totalSeconds = 0;

            if (hours != undefined) {
                totalSeconds += parseInt(hours) * 60 * 60;
            }

            if (minutes != undefined) {
                totalSeconds += parseInt(minutes) * 60;
            }

            if (seconds != undefined) {
                totalSeconds += parseInt(seconds);
            }

            return totalSeconds;
        }
    });

    environment.addFilter("formatRating", (classification, advisoryWarnings) => {
       let ratingBase = classification.replace("_", "");

       if (advisoryWarnings != undefined) {
           ratingBase += advisoryWarnings.join("");
       }

       return ratingBase;
    });

    console.log("registered helpers");
}

function formatDuration(minutes: number, hours: number) {
    let returnValue = '';

    if (hours != undefined && hours != 0) {
        returnValue = `${hours} hr`

        if (hours > 1)
            returnValue += 's';
    }

    if (minutes != undefined && minutes != 0) {
        if (returnValue != '') {
            returnValue += ' ';
        }

        returnValue += `${minutes} min`;

        if (minutes > 1)
            returnValue += 's';
    }

    return returnValue;
}

function subtractDuration(duration1: string, duration2: string) {
    const matches1 = duration1.match(iso8601DurationRegex);
    const matches2 = duration2.match(iso8601DurationRegex);

    if (matches1 != null && matches2 != null) {
        // We're going to be a bit lazy here and only subtract hours + minutes
        const hours1 = matches1[6];
        const hours2 = matches2[6];

        const minutes1 = matches1[7];
        const minutes2 = matches2[7];

        let totalMinutes1 = 0;
        let totalMinutes2 = 0;

        if (hours1 != undefined) {
            totalMinutes1 += parseInt(hours1) * 60;
        }
        if (hours2 != undefined) {
            totalMinutes2 += parseInt(hours2) * 60;
        }

        if (minutes1 != undefined) {
            totalMinutes1 += parseInt(minutes1);
        }
        if (minutes2 != undefined) {
            totalMinutes2 += parseInt(minutes2);
        }

        const difference = Math.abs(totalMinutes1 - totalMinutes2);

        return { difference: difference, totalMinutes1: totalMinutes1, totalMinutes2: totalMinutes2 };
    }

    throw new Error("Something has gone wrong");
}
