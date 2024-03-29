import { Card } from 'primereact/card'
import { Divider } from 'primereact/divider'
import { Timeline } from 'primereact/timeline'
import React, { useEffect, useState } from 'react'
import { Tooltip } from 'primereact/tooltip'
import ServiceLogForm from '@/forms/Inventory/ServiceLogForm'
import { Button } from 'primereact/button'
import axios from '@/lib/axios'
import { Panel } from 'primereact/panel'
import CollapsiblePanelTemplate from '@/components/Templates/CollapsiblePanelTemplate'
import ServiceLogService from '@/services/Inventory/ServiceLogService'
import Spinner from '@/components/Spinner'
import Restrict from '../Authorization/Restrict'

const ServiceLogsTimeline = ({ parentType, parentId }) => {
    const [editing, setEditing] = useState(false)
    const [logs, setLogs] = useState(null)
    const [loaded, setLoaded] = useState(false)

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
                .finally(() => {
                    setLoaded(true)
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
                    <Restrict permission={'service:delete'}>
                        <div
                            className={
                                'w-full flex justify-content-end ml-2 -mb-4'
                            }>
                            <Button
                                className={
                                    'p-button-danger justify-content-center'
                                }
                                onClick={() => {
                                    deleteServiceLog(item?.log?.id)
                                }}>
                                <i className={'ti ti-trash'} />
                            </Button>
                        </div>
                    </Restrict>
                </Card>
            </>
        )
    }

    useEffect(() => {
        refreshLogs()
    }, [parentId])

    return (
        <Restrict permission={'service:read'}>
            <div className={'my-4'}>
                {!loaded ? (
                    <div className="card flex justify-content-center">
                        <Spinner />
                    </div>
                ) : (
                    <Panel
                        toggleable
                        headerTemplate={options => {
                            return CollapsiblePanelTemplate(
                                options,
                                'Service Logs',
                            )
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
                            <Restrict permission={'service:create'}>
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
                            </Restrict>
                        )}

                        {logs?.length > 0 && <Divider />}

                        <Timeline
                            value={logs?.map(log => {
                                return {
                                    log: log,
                                    icon: log?.service?.type?.icon,
                                }
                            })}
                            align="alternate"
                            marker={customizedTimelineMarker}
                            content={customizedTimelineContent}
                        />
                    </Panel>
                )}
            </div>
        </Restrict>
    )
}

export default ServiceLogsTimeline
