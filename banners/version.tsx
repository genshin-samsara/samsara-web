import {Featured, FeaturedVersions, VersionParts} from "@/banners/types";
import _ from "lodash";

type VersionCount = {
    [version: string]: number
}


export function getBaseVersion(version: string): string {
    return version.substring(0, version.lastIndexOf('.'))
}

export function getVersionPart(version: string): number {
    return parseInt(version.substring(version.lastIndexOf('.') + 1))
}

export default function getVersionParts(versions: string[], orders: boolean | "asc" | "desc" = 'desc'): VersionParts[] {
    const versionCounts: VersionCount = {}
    for (const version of versions) {
        versionCounts[getBaseVersion(version)] = Math.max(
            versionCounts[getBaseVersion(version)] || 0,
            getVersionPart(version),
        )
    }

    return _.chain(versionCounts)
        .transform((res: VersionParts[], parts: number, version: string) => res.push({version, parts}), [])
        .orderBy((vp: VersionParts) => vp.version, orders)
        .value()
}