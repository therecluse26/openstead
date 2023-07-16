import { ProgressSpinner } from 'primereact/progressspinner'

const Spinner = () => {
    return (
        <ProgressSpinner
            pt={{
                spinner: { style: { animationDuration: '0.8s' } },
                circle: {
                    style: {
                        stroke: 'var(--primary-color)',
                        strokeWidth: 4,
                    },
                },
            }}
        />
    )
}

export default Spinner
