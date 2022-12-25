export type Banners = {
    characters: Banner;

    weapons: Banner;
}

export type Banner = {
    4: BannerResource;
    5: BannerResource;
}

export type BannerResource = {
    [name: string]: string[]
}