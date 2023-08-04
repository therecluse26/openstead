const CollapsiblePanelTemplate = (options, header) => {
    const toggleIcon = options.collapsed
        ? 'pi pi-chevron-down'
        : 'pi pi-chevron-up'
    const className = `${options.className} justify-content-start`
    const titleClassName = `${options.titleClassName} pl-1 text-lg`

    return (
        <div className={className}>
            <button
                className={options.togglerClassName}
                onClick={options.onTogglerClick}>
                <span className={toggleIcon} />
            </button>
            <span className={titleClassName}>{header}</span>
        </div>
    )
}

export default CollapsiblePanelTemplate
