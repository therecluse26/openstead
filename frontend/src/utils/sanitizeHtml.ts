// @ts-ignore - sanitize-html doesn't have TypeScript definitions
const sanitizeHtml = require('sanitize-html')

interface SanitizeOptions {
    allowedTags?: string[]
    allowedAttributes?: Record<string, string[]>
    allowedSchemes?: string[]
    allowedIframeDomains?: string[]
    [key: string]: any
}

export default function sanitizeHtmlContent(string: string): string {
    const options: SanitizeOptions = {
        allowedTags: [
            'p',
            'em',
            'strong',
            'b',
            'u',
            'i',
            'ul',
            'li',
            'ol',
            'a',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'img',
            'blockquote',
            'pre',
            'code',
            'span',
            'div',
            'br',
            'iframe',
        ],
        allowedAttributes: {
            iframe: ['src', 'class', 'frameborder', 'allowfullscreen'],
            img: [
                'src',
                'srcset',
                'alt',
                'title',
                'width',
                'height',
                'loading',
            ],
        },
        allowedSchemes: ['data', 'http'],
        allowedIframeDomains: [
            'youtube.com',
            'vimeo.com',
            'bitchute.com',
            'rumble.com',
            'odysee.com',
        ],
    }

    return sanitizeHtml(string, options)
}
