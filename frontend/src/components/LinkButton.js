import React from 'react'
import { Button } from 'primereact/button'
import Link from 'next/link'

const LinkButton = ({
    href,
    text,
    external = false,
    fontSize = '1.2rem',
    leftIcon = null,
    rightIcon = null,
    className = 'p-button-text',
}) =>
    external ? (
        <Button
            className={className}
            style={{ fontSize: fontSize }}
            onClick={() => {
                window.open(href)
            }}>
            <span>
                <i className={leftIcon} />
                {text}
                <i className={rightIcon} />
            </span>
        </Button>
    ) : (
        <Link href={href}>
            <Button className={className} style={{ fontSize: fontSize }}>
                <span>
                    <i className={leftIcon} />
                    {text}
                    <i className={rightIcon} />
                </span>
            </Button>
        </Link>
    )

export default LinkButton
