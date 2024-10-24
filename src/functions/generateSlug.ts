import slugify from "slugify";


const generateSlug = (title: string):string => {
    let slug = title;

    slug = slugify(slug,
        {
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true,      // convert to lower case, defaults to `false`
        strict: false,     // strip special characters except replacement, defaults to `false`
        locale: 'vi',      // language code of the locale to use
        trim: true         // trim leading and trailing replacement chars, defaults to `true`
    });
    
    return slug;
}

export default generateSlug;