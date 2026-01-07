import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import type { TaskSchedulePayload } from "../../lib/types/TaskSchedulePayload";
import { useToast } from "../../app/shared/components/toast/useToast";
import { DAYS_ABBREV } from "../../lib/common/constants";
import { useTaskSchedules } from "../../lib/hooks/useTaskSchedules";

const formatDisplayDate = (d?: string | Date | null) => {
    if (!d) return '';
    try {
        const dateObj = typeof d === 'string' ? new Date(d) : d;
        return dateObj instanceof Date && !isNaN(dateObj.getTime()) ? dateObj.toLocaleDateString() : String(d);
    } catch { return String(d); }
}

export default function TaskScheduleDetails({ taskSchedule }: { taskSchedule: TaskSchedulePayload }) {
    const { deleteTaskSchedule } = useTaskSchedules(taskSchedule?.taskId);
    const toast = useToast();

    const deleteSchedule = async () => {
        if (!taskSchedule?.taskId) return;
        const confirmed = window.confirm('Delete this schedule?');
        if (!confirmed) return;
        try {
            await deleteTaskSchedule.mutateAsync(taskSchedule.taskId);
            toast.success('Schedule deleted');
        } catch (err: unknown) {
            const httpError = err as { response?: { data?: { message?: string } } };
            const errorMsg = httpError.response?.data?.message || 'Error deleting the schedule.';
            toast.error(errorMsg);
        }
    };

    return (
        <Card className="border-0 shadow-sm">
            <Card.Body className="p-3">
                <Row className="align-items-center">
                    <Col>

                        {(taskSchedule.repeat === 'OneTime') && (
                            <div className="text-muted" style={{ fontSize: '0.85rem', textAlign: 'left' }}>
                                Due on {formatDisplayDate(taskSchedule.startDate)}
                            </div>
                        )}
                        {(taskSchedule.repeat === 'Daily' || taskSchedule.repeat === 'Monthly' || taskSchedule.repeat === 'Yearly') && (
                            <>
                                <div className="text-muted" style={{ fontSize: '0.85rem', textAlign: 'left' }}>
                                    Starts {formatDisplayDate(taskSchedule.startDate)}
                                </div>
                                <div className="text-muted" style={{ fontSize: '0.85rem', textAlign: 'left' }}>
                                    Repeat {taskSchedule.repeat}
                                </div>
                            </>
                        )}

                        {(taskSchedule.repeat === 'Weekly') && ((taskSchedule.selectedDays ?? []).length > 0) && (
                            <>
                                <div className="text-muted" style={{ fontSize: '0.85rem', textAlign: 'left' }}>
                                    Starts {formatDisplayDate(taskSchedule.startDate)}
                                </div>
                                 <div className="text-muted" style={{ fontSize: '0.85rem', textAlign: 'left' }}>
                                    Repeat {taskSchedule.repeat} on
                                </div>
                                <div className="mt-2">
                                    {(taskSchedule.selectedDays ?? []).map((d: number) => (
                                        <Badge key={d} bg="light" text="dark" className="me-1" style={{ fontSize: '0.8rem' }}>
                                            {DAYS_ABBREV[d]}
                                        </Badge>
                                    ))}
                                </div>
                            </>
                        )}

                        {(taskSchedule.repeat === 'Custom') && (
                            <>
                                <div className="text-muted" style={{ fontSize: '0.85rem', textAlign: 'left' }}>
                                    Starts {formatDisplayDate(taskSchedule.startDate)}
                                </div>
                                 <div className="text-muted" style={{ fontSize: '0.85rem', textAlign: 'left' }}>
                                    Repeat every {taskSchedule.customRepeat} {taskSchedule.customUnit}
                                </div>
                            </>
                        )}

                        {(taskSchedule.endDate || taskSchedule.endAfter) && (
                            <div className="mt-2 text-muted" style={{ fontSize: '0.85rem', textAlign: 'left' }}>
                                {taskSchedule.endDate ?
                                    `Ends on ${formatDisplayDate(taskSchedule.endDate)}` :
                                    `Ends after ${taskSchedule.endAfter} times`}
                            </div>
                        )}
                    </Col>

                    <Col xs="auto">
                        <Button
                            variant="outline-danger"
                            size="sm"
                            title="Delete schedule"
                            onClick={deleteSchedule}
                            disabled={deleteTaskSchedule.isLoading}
                        >
                            🗑
                        </Button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>

    )
}