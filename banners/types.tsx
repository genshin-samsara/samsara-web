import {Dispatch, SetStateAction} from "react";
import {Order} from "@/lotypes/sort";

export type BannerDataset = {
    fiveStarCharacters: Featured[]
    fourStarCharacters: Featured[]
    fiveStarWeapons: Featured[]
    fourStarWeapons: Featured[]
}

export type Featured = {
    name: string
} & FeaturedVersions & FeaturedDates

export type FeaturedHistory = {
    name: string
} & FeaturedVersions

export type FeaturedVersions = {
    versions: string[]
}

export type FeaturedDates = {
    dates: DateRange[]
}

export type DateRange = {
    start: string
    end: string
}

export type VersionParts = {
    version: string;
    parts: number;
}

export type DetailedFeaturedHistory = {
    name: string;
    image: string;
    runs: number;
    versions: string[];
    counter: number[];
}


export type BannerFilterSortOptions = {
    sortBy: string
    order: string
}

export type BannerOptionSetters = {
    setOrder: Dispatch<SetStateAction<any>>
    setSortBy: Dispatch<SetStateAction<any>>
}

export type BannerSummary = {
    versions: string[]
    dates: DateRange[]
}
export type CommonSummaryProperties = {
    versionParts: VersionParts[]
    featuredList: Featured[]
    type: string
    order: Order
    filterText: string
}