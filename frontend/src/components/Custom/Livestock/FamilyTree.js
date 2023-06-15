import React from 'react'
import { Panel } from 'primereact/panel'
import CollapsiblePanelTemplate from '@/components/Custom/Templates/CollapsiblePanelTemplate'
import { OrganizationChart } from 'primereact/organizationchart'
import Link from 'next/link'

const FamilyTree = ({
    original,
    ancestors = null,
    offspring = null,
    siblings = null,
}) => {
    const ancestorData = () => {
        return [
            {
                label:
                    original.name +
                    (original.date_of_death ? ' (deceased)' : ''),
                expanded: true,
                className: 'family-tree-self',
                children: ancestors?.map(a => {
                    return {
                        label: (
                            <Link href={`/inventory/livestock/${a.id}`}>
                                {a.name +
                                    (a.date_of_death ? ' (deceased)' : '')}
                            </Link>
                        ),
                        expanded: true,
                        className: 'family-tree-parent',
                    }
                }),
            },
        ]
    }

    const offspringData = () => {
        return [
            {
                label:
                    original?.name +
                    (original.date_of_death ? ' (deceased)' : ''),
                className: 'family-tree-self',
                expanded: true,
                children: offspring?.map(o => {
                    return {
                        label: (
                            <Link href={`/inventory/livestock/${o.id}`}>
                                {o.name +
                                    (o.date_of_death ? ' (deceased)' : '')}
                            </Link>
                        ),
                        expanded: true,
                        className: 'family-tree-child',
                    }
                }),
            },
        ]
    }

    const siblingData = sibling => {
        return [
            {
                label: (
                    <Link href={`/inventory/livestock/${sibling.id}`}>
                        {sibling.name +
                            (sibling.date_of_death ? ' (deceased)' : '')}
                    </Link>
                ),
                expanded: true,
                className: 'family-tree-self',
            },
        ]
    }

    return (
        <div className={'my-4'}>
            <Panel
                toggleable
                headerTemplate={options => {
                    return CollapsiblePanelTemplate(options, 'Family')
                }}>
                {ancestors?.length > 0 ||
                offspring?.length > 0 ||
                siblings?.length > 0 ? (
                    <div className={'grid'}>
                        {ancestors.length > 0 ? (
                            <div className={'col-12 lg:col-4'}>
                                <h5 className={'text-center'}>Parents</h5>
                                <OrganizationChart value={ancestorData()} />
                            </div>
                        ) : null}
                        {offspring.length > 0 ? (
                            <div className={'col-12 lg:col-4'}>
                                <h5 className={'text-center'}>Children</h5>
                                <OrganizationChart value={offspringData()} />
                            </div>
                        ) : null}
                        {siblings.length > 0 ? (
                            <div className={'col-12 lg:col-4'}>
                                <h5 className={'text-center'}>Siblings</h5>
                                {siblings.map(s => {
                                    return (
                                        <OrganizationChart
                                            key={s.id}
                                            value={siblingData(s)}
                                        />
                                    )
                                })}
                            </div>
                        ) : null}
                    </div>
                ) : (
                    'No relatives to display'
                )}
            </Panel>
        </div>
    )
}

export default FamilyTree
