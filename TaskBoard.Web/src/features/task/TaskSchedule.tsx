import { useEffect } from "react";
import { Button, ButtonGroup, Col, Dropdown, Form, Row, Card, Badge } from "react-bootstrap";
import DatePicker from "react-datepicker";
import type { Task } from "../../lib/types/Task";
import 'react-datepicker/dist/react-datepicker.css';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskScheduleSchema, type TaskScheduleSchema } from "../../lib/schemas/taskScheduleSchema";
import { useToast } from "../../app/shared/components/toast/useToast";
import { formatToYMD } from "../../lib/util/util";
import type { TaskSchedulePayload } from "../../lib/types/TaskSchedulePayload";
import { useTaskSchedules } from "../../lib/hooks/useTaskSchedules";
import { getDate } from "date-fns";

const QUICK_DATES = [
    { id: 'today', label: 'Today', offset: 0 },
    { id: 'tomorrow', label: 'Tomorrow', offset: 1 },
    { id: 'nextWeek', label: 'Next Week', offset: 7 },
    { id: 'nextMonth', label: 'Next Month', offset: null }
] as const;

const DAYS_ABBREV = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const DAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const commonStyles = {
    btnSmall: { fontSize: '0.85rem', padding: '0.35rem 0.5rem' },
    smallText: { fontSize: '0.85rem' },
    smallLabel: { fontSize: '0.8rem' }
};

const DEFAULT_FORM_VALUES: Partial<TaskScheduleSchema> = {
    startDate: (new Date()).toLocaleString(),
    oneTimeOption: 'today',
    repeat: 'OneTime',
    customRepeat: '',
    customUnit: 'days',
    selectedDays: [],
    endType: 'never',
    endDate: null,
    endAfter: ''
};

export default function TaskSchedule({ userTask }: { userTask?: Task }) {
    const { taskSchedule, taskScheduleLoading, saveTaskSchedules, deleteTaskSchedule } = useTaskSchedules(userTask?.taskId);
    const toast = useToast();

    const { control, handleSubmit, reset, setValue, watch } = useForm<TaskScheduleSchema>({
        mode: 'onTouched',
        resolver: zodResolver(taskScheduleSchema),
        defaultValues: {
            taskId: userTask?.taskId,
            ...DEFAULT_FORM_VALUES,
            startDate: userTask?.date ?? null
        } as TaskScheduleSchema
    });

    const quickVal = watch('oneTimeOption');
    const repeat = watch('repeat');
    const customRepeatVal = watch('customRepeat');
    const customUnitVal = watch('customUnit');
    const selectedDaysVal = watch('selectedDays') ?? [];
    const endType = watch('endType');

    useEffect(() => {
        if (userTask) {
            const meta = userTask as unknown as { 
                repeat?: 'OneTime' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly' | 'Custom' 
            };
            reset({
                taskId: userTask.taskId,
                ...DEFAULT_FORM_VALUES,
                startDate: userTask.date ?? null,
                repeat: meta.repeat ?? 'None'
            } as TaskScheduleSchema);
        }
    }, [userTask, reset]);

    const setQuickDate = (id: string, offset: number | null) => {
        const d = new Date();
        if (offset !== null) d.setDate(d.getDate() + offset);
        else d.setMonth(d.getMonth() + 1);
        setValue('startDate', d);
        setValue('oneTimeOption', id);
    };

    const toggleDay = (idx: number) => {
        const current = watch('selectedDays') ?? [];
        setValue('selectedDays', current.includes(idx) ? current.filter(d => d !== idx) : [...current, idx]);
    };

    const onSubmit = async (data: TaskScheduleSchema) => {
        if (data.repeat === 'Weekly' && (data.selectedDays ?? []).length === 0) {
            toast.error('Please select the days.');
            return;
        }

        const payload: TaskSchedulePayload = {
            taskId: data.taskId,
            startDate: formatToYMD(data.startDate),
            oneTimeOption: data.oneTimeOption || null,
            repeat: data.repeat || 'None',
            customRepeat: data.customRepeat || '',
            customUnit: data.customUnit || 'days',
            selectedDays: data.selectedDays || [],
            endType: data.endType || 'never',
            endDate: formatToYMD(data.endDate),
            endAfter: data.endAfter || null
        };


        try {
            await saveTaskSchedules.mutateAsync(payload as unknown as TaskScheduleSchema);
            toast.success('Schedule saved successfully!');
        } catch (error: unknown) {
            const httpError = error as { response?: { data?: { message?: string } } };
            const errorMsg = httpError.response?.data?.message || 'Error adding the schedule.';
            toast.error(errorMsg);
        }
    };

    if (taskScheduleLoading) return <div>Loading Tasks...</div>

    const formatDisplayDate = (d?: string | Date | null) => {
        if (!d) return '';
        try {
            const dateObj = typeof d === 'string' ? new Date(d) : d;
            return dateObj instanceof Date && !isNaN(dateObj.getTime()) ? dateObj.toLocaleDateString() : String(d);
        } catch { return String(d); }
    }

    if (taskSchedule) {
       
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
    else {
        return (
            <Card className="border-0 shadow-sm">
                <Card.Body className="p-3">
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-2">
                            <h6 className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                                <span style={{ fontSize: '16px' }}>📅</span> Due Date
                            </h6>

                            <div className="mb-2">
                                <ButtonGroup size="sm" className="w-100" style={{ display: 'flex', gap: '2px' }}>
                                    {QUICK_DATES.map(({ id, label, offset }) => (
                                        <Button
                                            key={id}
                                            variant={quickVal === id ? 'primary' : 'outline-primary'}
                                            onClick={() => setQuickDate(id, offset)}
                                            className="flex-grow-1"
                                            style={commonStyles.btnSmall}
                                        >
                                            {label}
                                        </Button>
                                    ))}
                                </ButtonGroup>
                            </div>

                            <div className="mb-2">
                                <small className="text-muted d-block mb-1" style={commonStyles.smallLabel}>Or pick a date:</small>
                                <Controller name="startDate" control={control} render={({ field }) =>
                                     (<DatePicker selected={(field.value instanceof Date ? field.value : null) ?? null} 
                                        onChange={(d) => { 
                                            field.onChange(d); 
                                            setValue('oneTimeOption', null); 
                                        }} 
                                        dateFormat="MM-dd-yyyy" className="form-control form-control-sm" />)} />
                            </div>
                        </div>

                        <hr style={{ margin: '0.75rem 0' }} />

                        <div className="mb-2">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <Form.Check type="switch" id="repeat-switch" 
                                    label={<small style={{ fontSize: '0.9rem' }}>🔄 Repeat</small>} 
                                    checked={repeat !== 'OneTime'} 
                                    onChange={(e) => setValue('repeat', e.target.checked ? 'Daily' : 'OneTime')} 
                                    style={{ margin: 0 }} />
                                {repeat !== 'OneTime' &&
                                     (
                                     <Badge bg="info" text="dark" style={{ fontSize: '0.75rem' }}>
                                        {repeat === 'Custom' ? `${customRepeatVal} ${customUnitVal}` : repeat}
                                    </Badge>
                                )}
                            </div>

                            {repeat !== 'OneTime' && (
                                <div className="bg-light p-2 rounded" style={{ borderLeft: '3px solid #0d6efd' }}>
                                    <Dropdown className="mb-2">
                                        <Dropdown.Toggle size="sm" variant="secondary" className="w-100" style={{ fontSize: '0.85rem' }}>
                                            {repeat}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="w-100" style={{ fontSize: '0.85rem' }}>
                                            <Dropdown.Item onClick={(e) => { e.stopPropagation(); setValue('repeat', 'Daily'); }}>Daily</Dropdown.Item>
                                            <Dropdown.Item onClick={(e) => { e.stopPropagation(); setValue('repeat', 'Weekly'); }}>Weekly</Dropdown.Item>
                                            <Dropdown.Item onClick={(e) => { e.stopPropagation(); setValue('repeat', 'Monthly'); }}>Monthly</Dropdown.Item>
                                            <Dropdown.Item onClick={(e) => { e.stopPropagation(); setValue('repeat', 'Yearly'); }}>Yearly</Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item onClick={(e) => { e.stopPropagation(); setValue('repeat', 'Custom'); }}>Custom...</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>

                                    {repeat === 'Custom' && (
                                        <div className="mb-2 p-2 bg-white rounded border border-secondary border-opacity-25">
                                            <small className="text-muted d-block mb-1" style={{ fontSize: '0.8rem' }}>Every</small>
                                            <Row className="g-1" style={{ fontSize: '0.85rem' }}>
                                                <Col xs={6}>
                                                    <Controller name="customRepeat" control={control} 
                                                        render={({ field }) => (<Form.Control type="number" min={1} placeholder="#" {...field} className="form-control-sm" />)} />
                                                </Col>
                                                <Col xs={6}>
                                                    <Dropdown onSelect={(k, e) => { e?.stopPropagation(); k && setValue('customUnit', k as 'days' | 'weeks' | 'months' | 'years') }} className="w-100">
                                                        <Dropdown.Toggle size="sm" variant="secondary" className="w-100" style={{ fontSize: '0.85rem' }}>{customUnitVal}</Dropdown.Toggle>
                                                        <Dropdown.Menu className="w-100" style={{ fontSize: '0.85rem' }}>
                                                            <Dropdown.Item eventKey="days">days</Dropdown.Item>
                                                            <Dropdown.Item eventKey="weeks">weeks</Dropdown.Item>
                                                            <Dropdown.Item eventKey="months">months</Dropdown.Item>
                                                            <Dropdown.Item eventKey="years">years</Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </Col>
                                            </Row>
                                        </div>
                                    )}

                                    {repeat === 'Weekly' && (
                                        <div className="mb-2 p-2 bg-white rounded border border-secondary border-opacity-25">
                                            <small className="text-muted d-block mb-1" style={commonStyles.smallLabel}>Days</small>
                                            <ButtonGroup size="sm" className="w-100" style={{ display: 'flex', gap: '2px' }}>
                                                {DAYS_ABBREV.map((day, idx) => (<Button key={idx} variant={selectedDaysVal.includes(idx) ? 'primary' : 'outline-secondary'} size="sm" onClick={() => toggleDay(idx)} className="flex-grow-1" title={DAYS_FULL[idx]} style={{ fontSize: '0.75rem', padding: '0.25rem 0.3rem' }}>{day}</Button>))}
                                            </ButtonGroup>
                                        </div>
                                    )}

                                    <div className="p-2 bg-white rounded border border-secondary border-opacity-25" style={{ fontSize: '0.85rem' }}>
                                        <small className="text-muted d-block mb-1" style={{ fontSize: '0.8rem' }}>Ends</small>
                                        <div className="d-flex flex-column gap-1">
                                            <Form.Check type="radio" name="endType" id="endType-never" label={<small>Never</small>} checked={endType === 'never'}
                                                onChange={() => {
                                                    setValue('endType', 'never');
                                                    setValue('endAfter', '');
                                                    setValue('endDate', null);
                                                }} style={{ fontSize: '0.85rem' }} />
                                            <Form.Check type="radio" name="endType" id="endType-date" label={<small>On date</small>} checked={endType === 'endDate'} onChange={() => setValue('endType', 'endDate')} style={{ fontSize: '0.85rem' }} />
                                            {endType === 'endDate' && (
                                                <div className="ms-3 mt-1">
                                                    <Controller
                                                        name="endDate"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <DatePicker
                                                                selected={(field.value instanceof Date ? field.value : null) ?? null}
                                                                onChange={(d) => {
                                                                    field.onChange(d);
                                                                    setValue('endAfter', '');
                                                                }}
                                                                dateFormat="MM-dd-yyyy"
                                                                className="form-control form-control-sm"
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            )}
                                            <Form.Check type="radio" name="endType" id="endType-after" label={<small>After # times</small>} checked={endType === 'endAfter'} onChange={() => setValue('endType', 'endAfter')} style={{ fontSize: '0.85rem' }} />
                                            {endType === 'endAfter' && (
                                                <div className="ms-3 mt-1">
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                                        <Controller
                                                            name="endAfter"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Form.Control
                                                                    type="number"
                                                                    min={1}
                                                                    placeholder="#"
                                                                    value={field.value}
                                                                    onChange={(e) => {
                                                                        const v = e.target.value;
                                                                        field.onChange(v);
                                                                        // clear endDate when endAfter is set
                                                                        setValue('endDate', null);
                                                                    }}
                                                                    className="form-control-sm"
                                                                    style={{ maxWidth: '60px', fontSize: '0.85rem' }}
                                                                />
                                                            )}
                                                        />
                                                        <span>times</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="d-flex gap-1 pt-2">
                            <Button
                                variant="primary"
                                type="submit"
                                size="sm"
                                className="flex-grow-1"
                                style={{ fontSize: '0.85rem' }}

                            >
                                Save
                            </Button>
                            <Button variant="outline-secondary" size="sm" className="flex-grow-1" onClick={() => reset()} style={{ fontSize: '0.85rem' }}>Reset</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        );
    }
}