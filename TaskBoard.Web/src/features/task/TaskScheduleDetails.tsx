import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import type { TaskSchedule } from "../../lib/types/TaskSchedulePayload";
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

export default function TaskScheduleDetails({ taskSchedule }: { taskSchedule: TaskSchedule }) {
    const { deleteTaskSchedule } = useTaskSchedules(taskSchedule?.taskId);
    console.log(10, deleteTaskSchedule);
    const toast = useToast();

    return (
        <Card className="border-0 shadow-sm">
            <Card.Body className="p-3">
                <Row className="align-items-center">
                    <Col>
                        <div className="d-flex align-items-center gap-2 mb-1">
                            <h6 className="mb-0" style={{ fontSize: '0.95rem' }}>
                                {taskSchedule.frequency === 'Custom' ? taskSchedule.interval : taskSchedule.frequency}
                            </h6>
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.85rem', textAlign: 'left' }}>
                            Starts {formatDisplayDate(taskSchedule.startDate)}
                        </div>

                        {(taskSchedule.frequency === 'Weekly') && ((taskSchedule.daysOfWeek ?? []).length > 0) && (
                            <div className="mt-2">
                                {(taskSchedule.daysOfWeek ?? []).map((d: number) => (
                                    <Badge key={d} bg="light" text="dark" className="me-1" style={{ fontSize: '0.8rem' }}>
                                        {DAYS_ABBREV[d]}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {(taskSchedule.endDate || taskSchedule.stopAfter) && (
                            <div className="mt-2 text-muted" style={{ fontSize: '0.85rem', textAlign: 'left' }}>
                                {taskSchedule.endDate ?
                                    `Ends on ${formatDisplayDate(taskSchedule.endDate)}` :
                                    `Ends after ${taskSchedule.stopAfter} times`}
                            </div>
                        )}
                    </Col>

                    <Col xs="auto">
                        <Button
                            variant="outline-danger"
                            size="sm"
                            title="Delete schedule"
                            onClick={async () => {
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
                            }}
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