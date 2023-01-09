import {getBaseVersion, getVersionPart} from "@/banners/version";
import _ from "lodash";
import dayjs from "dayjs";
import {VersionParts} from "@/banners/types";
import {getImageFromName} from "@/format/image";
import utc from "dayjs/plugin/utc";

const HighRange = 60
const MidRange = 25
export const UnknownFutureCount = -999999999

export type CountSummary = {
    name: string
    image: string
    count: number
}

export type AverageCountSummary = {
    name: string
    image: string
    average: number
    standardDeviation: number
    count: number
    discrepancy: boolean
}

export type BannerSummary = {
    versions: string[]
    dates: DateRange[]
}

export type DateRange = {
    start: string
    end: string
}

export type CommonSummaryProperties = {
    versionParts: VersionParts[]
    banners: { [name: string]: BannerSummary }
    type: string
    order: 'asc' | 'desc' | boolean
    filterText: string
}

export function getPatchGap(versionParts: VersionParts[], oldVersion: string, newVersion: string): number {
    const baseOldVersion = getBaseVersion(oldVersion)
    const baseNewVersion = getBaseVersion(newVersion)

    return _.findIndex(versionParts, (vp) => vp.version === baseNewVersion)
        - _.findIndex(versionParts, (vp) => vp.version === baseOldVersion);
}

export function getBannerGap(versionParts: VersionParts[], oldVersion: string, newVersion: string): number {
    const baseOldVersion = getBaseVersion(oldVersion)
    const baseOldVersionPart = getVersionPart(oldVersion)
    const baseNewVersion = getBaseVersion(newVersion)
    const baseNewVersionPart = getVersionPart(newVersion)

    if (baseOldVersion == baseNewVersion) {
        return baseNewVersionPart - baseOldVersionPart - 1
    }

    let startIndex = _.findIndex(versionParts, (vp) => vp.version === baseOldVersion);
    const endIndex = _.findIndex(versionParts, (vp) => vp.version === baseNewVersion);

    let total = versionParts[startIndex].parts - baseOldVersionPart
    while (++startIndex < endIndex) {
        total += versionParts[startIndex].parts
    }

    total += baseNewVersionPart - 1

    return total
}

export function getColorClassName(p: number): string {
    if (p >= HighRange) {
        return 'dark'
    } else if (p >= MidRange) {
        return 'normal'
    }
    return 'light'
}

export function getPercent(nom: number, denom: number): number {
    if (nom < 0) {
        return 0
    }

    return 100 * Math.max(0, nom) / Math.max(1, denom)
}

export function getFilterFunction(filterText: string): (s: { name: string }) => boolean {
    if (!filterText.trim().length) {
        return () => true
    }

    if (filterText.startsWith('/') && filterText.endsWith('/')) {
        try {
            const re = new RegExp(filterText.substring(1, filterText.length - 1), 'i')
            return (s) => re.test(s.name)
        } catch (ignore) {

        }
    }

    return (s) => s.name.toLowerCase().includes(filterText!.toLowerCase())
}

function getCountSummary(
    versionParts: VersionParts[],
    bannerSummaries: { [name: string]: BannerSummary },
    calculate: (banner: BannerSummary) => number,
): CountSummary[] {
    const result: CountSummary[] = []

    _.forIn(bannerSummaries, (banner, name) => {
        result.push({
            name,
            image: getImageFromName(name),
            count: calculate(banner),
        })
    })

    return result
}

export function getDaysSinceRunCountSummary(
    versionParts: VersionParts[],
    bannerSummaries: { [name: string]: BannerSummary },
    currDate: string,
): CountSummary[] {
    dayjs.extend(utc);

    function getLastEnd(banner: BannerSummary): string {
        return banner.dates[banner.dates.length - 1].end
    }

    function getLastStart(banner: BannerSummary): string {
        return banner.dates[banner.dates.length - 1].start
    }

    const currDayjs = dayjs.utc(currDate)
    return getCountSummary(
        versionParts,
        bannerSummaries,
        (banner) => {
            if (getLastEnd(banner) && getLastStart(banner)) {
                if (currDayjs.isBefore(dayjs.utc(getLastStart(banner)))) {
                    return currDayjs.diff(dayjs.utc(getLastStart(banner)), 'day')
                }

                return Math.max(0, currDayjs.diff(dayjs.utc(getLastEnd(banner)), 'day'))
            }

            if (getLastStart(banner) && currDayjs.isBefore(dayjs.utc(getLastStart(banner)))) {
                return currDayjs.diff(dayjs.utc(getLastStart(banner)), 'day')
            }

            return UnknownFutureCount
        },
    )
}


export function getBannersSinceLastCountSummary(
    versionParts: VersionParts[],
    bannerSummaries: { [name: string]: BannerSummary },
): CountSummary[] {
    return getCountSummary(
        versionParts,
        bannerSummaries,
        (banner) => getBannerGap(
            versionParts,
            banner.versions[banner.versions.length - 1],
            `${versionParts[versionParts.length - 1].version}.${versionParts[versionParts.length - 1].parts}`
        ) + 1,
    )
}

export function getPatchesSinceLastCountSummary(
    versionParts: VersionParts[],
    bannerSummaries: { [name: string]: BannerSummary },
): CountSummary[] {
    return getCountSummary(
        versionParts,
        bannerSummaries,
        (banner) => getPatchGap(
            versionParts,
            banner.versions[banner.versions.length - 1],
            `${versionParts[versionParts.length - 1].version}.${versionParts[versionParts.length - 1].parts}`
        ),
    )
}

export function getRunsCountSummary(
    versionParts: VersionParts[],
    bannerSummaries: { [name: string]: BannerSummary },
): CountSummary[] {
    return getCountSummary(
        versionParts,
        bannerSummaries,
        (banner) => banner.versions.length,
    )
}

function getAverageCountSummary(
    versionParts: VersionParts[],
    bannerSummaries: { [name: string]: BannerSummary },
    calculateAll: (versionParts: VersionParts[], banner: BannerSummary) => number[],
): AverageCountSummary[] {
    const result: AverageCountSummary[] = []

    _.forIn(bannerSummaries, (banner, name) => {
        const counters = calculateAll(versionParts, banner)
        const average = counters.length ? _.sum(counters) / counters.length : 0
        const standardDeviation = counters.length ? Math.sqrt(
            _.sumBy(
                counters,
                (c) => Math.pow(c - average, 2)
            ) / counters.length
        ) : 0

        result.push({
            name,
            image: getImageFromName(name),
            count: counters.length + 1,
            average: _.round(average, 1),
            standardDeviation: _.round(standardDeviation, 1),
            discrepancy: counters.length + 1 != banner.versions.length,
        })
    })

    return result
}

export function getAverageDaysInBetween(
    versionParts: VersionParts[],
    bannerSummaries: { [name: string]: BannerSummary },
): AverageCountSummary[] {
    dayjs.extend(utc);

    function getDayGaps(ignore: any, banner: BannerSummary): number[] {
        const result = []
        for (let i = 0; i < banner.dates.length - 1; i++) {
            if (banner.dates[i].end == '' || banner.dates[i + 1].start == '') {
                continue
            }
            result.push(dayjs.utc(banner.dates[i + 1].start).diff(dayjs.utc(banner.dates[i].end), 'day'))
        }

        return result
    }

    return getAverageCountSummary(
        versionParts,
        bannerSummaries,
        getDayGaps,
    )
}

export function getAverageBannersInBetween(
    versionParts: VersionParts[],
    bannerSummaries: { [name: string]: BannerSummary },
): AverageCountSummary[] {
    function getAvgBannerGaps(versionParts: VersionParts[], banner: BannerSummary): number[] {
        const result = []
        for (let i = 0; i < banner.versions.length - 1; i++) {
            result.push(getBannerGap(versionParts, banner.versions[i], banner.versions[i + 1]))
        }

        return result
    }

    return getAverageCountSummary(
        versionParts,
        bannerSummaries,
        getAvgBannerGaps,
    )
}

export function getAveragePatchesInBetween(
    versionParts: VersionParts[],
    bannerSummaries: { [name: string]: BannerSummary },
): AverageCountSummary[] {
    function getAvgPatchGaps(versionParts: VersionParts[], banner: BannerSummary): number[] {
        const result = []
        for (let i = 0; i < banner.versions.length - 1; i++) {
            result.push(getPatchGap(versionParts, banner.versions[i], banner.versions[i + 1]))
        }

        return result
    }

    return getAverageCountSummary(
        versionParts,
        bannerSummaries,
        getAvgPatchGaps,
    )
}