
declare namespace PostCSSAssets {
    export type Options = {
        variants?: {
            [font: string]: {
                [weight: string]: string[]
            }
        },
        display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional',
        hosted?: string[],
        aliases?: {
            [alias: string]: string
        },
        async?: string | `${string}.js`,
        formats?: 'local' | 'woff2'| 'woff' | 'ttf' | 'eot' | 'svg' | 'otf',
        foundries?: 'custom' | 'hosted' | 'bootstrap' | 'google',
        protocol?: string,
        custom?: {}
    }

    export default function assets(options: Options)
}

export = PostCSSAssets
