import sanitizeHtml from 'sanitize-html'

export default function (string) {
    return sanitizeHtml(string, {
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
    })
}
