import React, { useCallback, useEffect, useRef, useState } from 'react'
import { RadioButton } from 'primereact/radiobutton'
import classNames from 'classnames'
import { Button } from 'primereact/button'

interface AppConfigProps {
    layoutMode: string
    onLayoutModeChange: (mode: string) => void
}

export const AppConfig: React.FC<AppConfigProps> = props => {
    const [active, setActive] = useState<boolean>(false)
    const [scale, setScale] = useState<number>(14)
    const [scales] = useState<number[]>([12, 13, 14, 15, 16])
    const config = useRef<HTMLDivElement>(null)
    let outsideClickListener = useRef<((event: Event) => void) | null>(null)

    const unbindOutsideClickListener = useCallback(() => {
        if (outsideClickListener.current) {
            document.removeEventListener('click', outsideClickListener.current)
            outsideClickListener.current = null
        }
    }, [])

    const hideConfigurator = useCallback(
        (event: Event) => {
            setActive(false)
            unbindOutsideClickListener()
            event.preventDefault()
        },
        [unbindOutsideClickListener],
    )

    const bindOutsideClickListener = useCallback(() => {
        if (!outsideClickListener.current) {
            outsideClickListener.current = (event: Event) => {
                if (active && isOutsideClicked(event)) {
                    hideConfigurator(event)
                }
            }
            document.addEventListener('click', outsideClickListener.current)
        }
    }, [active, hideConfigurator])

    useEffect(() => {
        if (active) {
            bindOutsideClickListener()
        } else {
            unbindOutsideClickListener()
        }
    }, [active, bindOutsideClickListener, unbindOutsideClickListener])

    const isOutsideClicked = (event: Event): boolean => {
        return !(
            config.current?.isSameNode(event.target as Node) ||
            config.current?.contains(event.target as Node)
        )
    }

    const decrementScale = () => {
        setScale(prevState => --prevState)
    }

    const incrementScale = () => {
        setScale(prevState => ++prevState)
    }

    useEffect(() => {
        document.documentElement.style.fontSize = scale + 'px'
    }, [scale])

    const toggleConfigurator = () => {
        setActive(prevState => !prevState)
    }

    const configClassName = classNames('layout-config', {
        'layout-config-active': active,
    })

    return (
        <div ref={config} className={configClassName} id={'layout-config'}>
            <button
                className="layout-config-button p-link"
                id="layout-config-button"
                onClick={toggleConfigurator}>
                <i className="pi pi-cog" />
            </button>
            <Button
                className="p-button-danger layout-config-close p-button-rounded p-button-text"
                icon="pi pi-times"
                onClick={hideConfigurator}
            />

            <div className="layout-config-content">
                <h5 className="mt-0">Component Scale</h5>
                <div className="config-scale">
                    <Button
                        icon="pi pi-minus"
                        onClick={decrementScale}
                        className="p-button-text"
                        disabled={scale === scales[0]}
                    />
                    {scales.map(item => {
                        return (
                            <i
                                className={classNames('pi pi-circle-on', {
                                    'scale-active': item === scale,
                                })}
                                key={item}
                            />
                        )
                    })}
                    <Button
                        icon="pi pi-plus"
                        onClick={incrementScale}
                        className="p-button-text"
                        disabled={scale === scales[scales.length - 1]}
                    />
                </div>

                <h5>Menu Type</h5>
                <div className="p-formgroup-inline">
                    <div className="field-radiobutton">
                        <RadioButton
                            inputId="static"
                            name="layoutMode"
                            value="static"
                            onChange={e => props.onLayoutModeChange(e.value)}
                            checked={props.layoutMode === 'static'}
                        />
                        <label htmlFor="static">Static</label>
                    </div>
                    <div className="field-radiobutton">
                        <RadioButton
                            inputId="overlay"
                            name="layoutMode"
                            value="overlay"
                            onChange={e => props.onLayoutModeChange(e.value)}
                            checked={props.layoutMode === 'overlay'}
                        />
                        <label htmlFor="overlay">Overlay</label>
                    </div>
                </div>
            </div>
        </div>
    )
}
