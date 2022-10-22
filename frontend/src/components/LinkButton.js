import { Button } from 'primereact/button'
import Link from 'next/link'
import React from 'react'

const LinkButton = ({
    href,
    text,
    fontSize = '1.2rem',
    leftIcon = null,
    rightIcon = null,
}) => (
    <Button className="p-button-text" style={{ fontSize: fontSize }}>
        <Link href={href}>
            <span>
                <i className={leftIcon} />
                {text}
                <i className={rightIcon} />
            </span>
        </Link>
    </Button>
)

export default LinkButton
