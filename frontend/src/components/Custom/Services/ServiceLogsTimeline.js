import { Card } from 'primereact/card'
import { Divider } from 'primereact/divider'
import { Timeline } from 'primereact/timeline'
import React, { useEffect, useState } from 'react'
import { Tooltip } from 'primereact/tooltip'
import ServiceLogForm from '@/components/Forms/Inventory/ServiceLogForm'
import { Button } from 'primereact/button'
import axios from '@/lib/axios'

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

const ServiceLogsTimeline = ({ parentType, parentId }) => {
    const [editing, setEditing] = useState(false)
    const [logs, setLogs] = useState(null)

    const refreshLogs = async () => {
        if (parentType && parentId) {
            const data = await axios
                .get(`/api/services/logs/${parentType}/${parentId}`)
                .then(res => res.data)
                .catch(e => {
                    console.error(e)
                    alert('Failed to retrieve service logs')
                })
            setLogs(data)
        }
    }

    useEffect(() => {
        refreshLogs()
    }, [parentId])

    return (
        <div className={'my-4'}>
            <h5 className={'text-center'}>Service Logs</h5>

            <Card>
                {editing === true ? (
                    <ServiceLogForm
                        inline={true}
                        onClose={() => {
                            setEditing(false)
                        }}
                        onComplete={() => {
                            setEditing(false)
                            refreshLogs()
                        }}
                    />
                ) : (
                    <div className={'flex justify-content-center'}>
                        <Button
                            onClick={() => {
                                setEditing(true)
                            }}>
                            <span>
                                <i className={'ti ti-plus'} />
                                {' New'}
                            </span>
                        </Button>
                    </div>
                )}

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
