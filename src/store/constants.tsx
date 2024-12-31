type iCategories={
    mainCategory: string,
    subCategories: Array<string>
}

export const categories: Array<iCategories>= [
    {
        mainCategory:"Exercise And Fitness",
        subCategories:["Sport and Exercise","Waist Trainers and Body Shapers"]
    },
    {
        mainCategory:"Fashion",
        subCategories:["Men","Women","Children"]
    },
    {
        mainCategory:"Haircare",
        subCategories:["Clippers","Hair Accesories","Hair Dryers","Hair Straightners"]
    },
    {
        mainCategory:"Home and Kitchen",
        subCategories:["Appliances","Cleaners","Home","Kitchen"]
    },
    {
        mainCategory:"Phones and Laptop Accesories",
        subCategories:[]
    },
    {
        mainCategory:"Health and Beauty",
        subCategories:["Medical","Herbal Tea","Oils Serums and Organics","Toothpaste and ToothCare"]
    },
    {
        mainCategory:"Electronics",
        subCategories:[]
    },
    {
        mainCategory:"Kiddies",
        subCategories:["Accesories","Back to School","Clothes","Shoes"]
    },
    {
        mainCategory:"Others",
        subCategories:[]
    }
]