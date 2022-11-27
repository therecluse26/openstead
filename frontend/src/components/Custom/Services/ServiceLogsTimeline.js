import { Card } from 'primereact/card'
import { Divider } from 'primereact/divider'
import { Timeline } from 'primereact/timeline'
import React, { useEffect, useState } from 'react'
import { Tooltip } from 'primereact/tooltip'
import ServiceLogForm from '@/forms/Inventory/ServiceLogForm'
import { Button } from 'primereact/button'
import axios from '@/lib/axios'
import { Panel } from 'primereact/panel'
import CollapsiblePanelTemplate from '@/components/Custom/Templates/CollapsiblePanelTemplate'
import ServiceLogService from '@/services/inventory/ServiceLogService'

const ServiceLogsTimeline = ({ parentType, parentId }) => {
    const [editing, setEditing] = useState(false)
    const [logs, setLogs] = useState(null)

    const refreshLogs = () => {
        if (parentType && parentId) {
            axios
                .get(`/api/services/logs/${parentType}/${parentId}`)
                .then(res => res.data)
                .then(data => {
                    setLogs(data)
                })
                .catch(() => {
                    alert('Failed to retrieve service logs')
                })
        }
    }

    const deleteServiceLog = id => {
        ServiceLogService.deleteServiceLog(id).then(() => {
            refreshLogs()
        })
    }

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
                    <div
                        className={
                            'w-full flex justify-content-end ml-2 -mt-4 -mb-4'
                        }>
                        <Button
                            className={'p-button-danger'}
                            onClick={() => {
                                deleteServiceLog(item?.log?.id)
                            }}>
                            <i className={'ti ti-trash'} />
                        </Button>
                    </div>
                </Card>
            </>
        )
    }

    useEffect(() => {
        refreshLogs()
    }, [parentId])

    return (
        <div className={'my-4'}>
            <Panel
                toggleable
                headerTemplate={options => {
                    return CollapsiblePanelTemplate(options, 'Service Logs')
                }}>
                {editing === true ? (
                    <ServiceLogForm
                        inline={true}
                        serviceable_type={parentType}
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

                {logs?.length > 0 && <Divider />}

                <Timeline
                    value={logs?.map(log => {
                        return { log: log, icon: log?.service?.type?.icon }
                    })}
                    align="alternate"
                    marker={customizedTimelineMarker}
                    content={customizedTimelineContent}
                />
            </Panel>
        </div>
    )
}

export default ServiceLogsTimeline
