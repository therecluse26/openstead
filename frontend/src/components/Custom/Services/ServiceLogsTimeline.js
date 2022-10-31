import { Card } from 'primereact/card'
import LinkButton from '@/components/LinkButton'
import { Divider } from 'primereact/divider'
import { Timeline } from 'primereact/timeline'
import React from 'react'
import { Tooltip } from 'primereact/tooltip'

const customizedTimelineMarker = item => {
    return (
        <span
            className="surface-ground shadow-1  p-3"
            style={{
                borderRadius: '50%',
            }}>
            <Tooltip target={`.tooltip_` + item?.log?.service?.id} />
            <span
                className={`tooltip_` + item?.log?.service?.id}
                data-pr-tooltip={item?.log?.service?.type?.label}>
                {item?.icon}
            </span>
        </span>
    )
}

const customizedTimelineContent = item => {
    return (
        <>
            <Card
                title={item?.log?.service?.title}
                subTitle={item?.log?.service_date}
                className={'shadow-4 surface-overlay'}>
                <p>{item?.log?.notes}</p>
            </Card>
        </>
    )
}

const ServiceLogsTimeline = ({ logs, inventoryType, inventoryId }) => {
    return (
        <div className={'my-4'}>
            <h5 className={'text-center'}>Service Logs</h5>

            <Card>
                <div className={'flex justify-content-center'}>
                    <LinkButton
                        href={`/inventory/${inventoryType}/${inventoryId}/add-service-log`}
                        leftIcon={'ti ti-plus'}
                        text={' New'}
                    />
                </div>

                {logs?.length > 0 ? <Divider /> : null}

                <Timeline
                    value={logs?.map(log => {
                        return { log: log, icon: log?.service?.type?.icon }
                    })}
                    align="alternate"
                    marker={customizedTimelineMarker}
                    content={customizedTimelineContent}
                />
            </Card>
        </div>
    )
}

export default ServiceLogsTimeline
