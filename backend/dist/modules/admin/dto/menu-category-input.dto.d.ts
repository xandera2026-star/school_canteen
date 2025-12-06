export declare enum MenuCategoryType {
    VEG = "veg",
    NON_VEG = "non_veg",
    SNACKS = "snacks",
    SOUTH_INDIAN = "south_indian",
    NORTH_INDIAN = "north_indian",
    SPECIAL = "special",
    DRINKS = "drinks"
}
export declare class MenuCategoryInputDto {
    name: string;
    type: MenuCategoryType;
    description?: string;
}
