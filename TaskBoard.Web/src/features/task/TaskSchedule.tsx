import { useEffect } from "react";
import { Button, ButtonGroup, Col, Dropdown, Form, Row, Card, Badge } from "react-bootstrap";
import DatePicker from "react-datepicker";
import type { Task } from "../../lib/types/Task";
import 'react-datepicker/dist/react-datepicker.css';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskScheduleSchema, type TaskScheduleSchema } from "../../lib/schemas/taskScheduleSchema";
import { useToast } from "../../app/shared/components/toast/useToast";
import { useTasks } from "../../lib/hooks/useTasks";

interface TaskSchedulePayload {
    taskId?: number;
    startDate: string | null;
    oneTimeOption: string | null;
    repeat: string;
    customRepeat: string;
    customUnit: string;
    selectedDays: number[];
    endType: string;
    endDate: string | null;
    endAfter: string | null;
}

export default function TaskSchedule({ userTask }: { userTask?: Task }) {
    const { saveTaskSchedules } = useTasks(userTask?.taskId);

    const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<any>({
        mode: 'onTouched',
        resolver: zodResolver(taskScheduleSchema),
        defaultValues: {
            taskId: userTask?.taskId,
            startDate: userTask?.date,
            oneTimeOption: 'today',
            repeat: 'None',
            customRepeat: '',
            customUnit: 'days',
            selectedDays: [],
            endType: 'never',
            endDate: null,
            endAfter: ''
        }
    });

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayAbbrev = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const quickVal = watch('oneTimeOption');
    const repeat = watch('repeat');
    const customRepeatVal = watch('customRepeat');
    const customUnitVal = watch('customUnit');
    const selectedDaysVal = watch('selectedDays') ?? [];
    const endType = watch('endType');

    const toast = useToast();

    useEffect(() => {
        if (userTask) {
            const meta = userTask as unknown as { details?: string; repeat?: 'None' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly' | 'Custom' };
            reset({
                taskId: userTask.taskId,
                startDate: userTask.date,
                oneTimeOption: 'today',
                repeat: meta.repeat ?? 'None',
                customRepeat: '',
                customUnit: 'days',
                selectedDays: [],
                endType: 'never',
                endDate: null,
                endAfter: ''
            });
        }
    }, [userTask, reset]);

    const toggleDay = (idx: number) => {
        const current: number[] = watch('selectedDays') ?? [];
        const exists = current.includes(idx);
        const next = exists ? current.filter(d => d !== idx) : [...current, idx];
        setValue('selectedDays', next);
    };

    const onSubmit = async (data: TaskScheduleSchema) => {
         console.log('Submitting schedule:', data);

        if (data.repeat == 'Weekly' && data.selectedDays.length === 0) {
            toast.error('Please select the days.');
            return;
        }

        let sd = new Date(data.startDate);
        let ed = new Date(data.endDate);

        // Send data with exact field names expected by backend
        const payload: TaskSchedulePayload = {
            taskId: data.taskId,
            startDate: `${sd.getMonth() + 1}-${sd.getDay()}-${sd.getFullYear()}`,
            oneTimeOption: data.oneTimeOption || null,
            repeat: data.repeat,
            customRepeat: data.customRepeat,
            customUnit: data.customUnit,
            selectedDays: data.selectedDays || [],
            endType: data.endType || 'never',
            endDate: `${ed.getMonth() + 1}-${ed.getDay()}-${ed.getFullYear()}`,
            endAfter: data.endAfter || null
        };

        console.log('Submitting schedule:', JSON.stringify(payload, null, 2));

        try {
            const result = await saveTaskSchedules.mutateAsync(payload as unknown as TaskScheduleSchema);
            console.log('Success response:', result);
            toast.success('Schedule saved successfully!');
        } catch (error: unknown) {
            console.error('Full error object:', error);
            const httpError = error as { response?: { data?: { message?: string } } };
            console.error('Schedule save error:', httpError.response?.data || error);
            const errorMsg = httpError.response?.data?.message || 'Error adding the schedule.';
            toast.error(errorMsg);
        }
    };

    return (
        <Card className="border-0 shadow-sm">
            <Card.Body className="p-3">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-2">
                        <h6 className="text-muted mb-2" style={{ fontSize: '0.9rem' }}><span style={{ fontSize: '16px' }}>📅</span> Due Date</h6>

                        <div className="mb-2">
                            <ButtonGroup size="sm" className="w-100" style={{ display: 'flex', gap: '2px' }}>
                                <Button variant={quickVal === 'today' ? 'primary' : 'outline-primary'} onClick={() => { const d = new Date(); setValue('startDate', d); setValue('oneTimeOption', 'today'); }} className="flex-grow-1" style={{ fontSize: '0.85rem', padding: '0.35rem 0.5rem' }}>Today</Button>
                                <Button variant={quickVal === 'tomorrow' ? 'primary' : 'outline-primary'} onClick={() => { const d = new Date(Date.now() + 24 * 60 * 60 * 1000); setValue('startDate', d); setValue('oneTimeOption', 'tomorrow'); }} className="flex-grow-1" style={{ fontSize: '0.85rem', padding: '0.35rem 0.5rem' }}>Tomorrow</Button>
                                <Button variant={quickVal === 'nextWeek' ? 'primary' : 'outline-primary'} onClick={() => { const d = new Date(); d.setDate(d.getDate() + 7); setValue('startDate', d); setValue('oneTimeOption', 'nextWeek'); }} className="flex-grow-1" style={{ fontSize: '0.85rem', padding: '0.35rem 0.5rem' }}>Next Week</Button>
                                <Button variant={quickVal === 'nextMonth' ? 'primary' : 'outline-primary'} onClick={() => { const d = new Date(); d.setMonth(d.getMonth() + 1); setValue('startDate', d); setValue('oneTimeOption', 'nextMonth'); }} className="flex-grow-1" style={{ fontSize: '0.85rem', padding: '0.35rem 0.5rem' }}>Next Month</Button>
                            </ButtonGroup>
                        </div>

                        <div className="mb-2">
                            <small className="text-muted d-block mb-1" style={{ fontSize: '0.8rem' }}>Or pick a date:</small>
                            <Controller name="startDate" control={control} render={({ field }) => (<DatePicker selected={field.value} onChange={(d) => { field.onChange(d); setValue('oneTimeOption', null); }} dateFormat="MM-dd-yyyy" className="form-control form-control-sm" />)} />
                        </div>
                    </div>

                    <hr style={{ margin: '0.75rem 0' }} />

                    <div className="mb-2">
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <Form.Check type="switch" id="repeat-switch" label={<small style={{ fontSize: '0.9rem' }}>🔄 Repeat</small>} checked={repeat !== 'None'} onChange={(e) => setValue('repeat', e.target.checked ? 'Daily' : 'None')} style={{ margin: 0 }} />
                            {repeat !== 'None' && (<Badge bg="info" text="dark" style={{ fontSize: '0.75rem' }}>{repeat === 'Custom' ? `${customRepeatVal} ${customUnitVal}` : repeat}</Badge>)}
                        </div>

                        {repeat !== 'None' && (
                            <div className="bg-light p-2 rounded" style={{ borderLeft: '3px solid #0d6efd' }}>
                                <Dropdown className="mb-2">
                                    <Dropdown.Toggle size="sm" variant="secondary" className="w-100" style={{ fontSize: '0.85rem' }}>{repeat}</Dropdown.Toggle>
                                    <Dropdown.Menu className="w-100" style={{ fontSize: '0.85rem' }}>
                                        <Dropdown.Item onClick={() => setValue('repeat', 'Daily')}>Daily</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setValue('repeat', 'Weekly')}>Weekly</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setValue('repeat', 'Monthly')}>Monthly</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setValue('repeat', 'Yearly')}>Yearly</Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={() => setValue('repeat', 'Custom')}>Custom...</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>

                                {repeat === 'Custom' && (
                                    <div className="mb-2 p-2 bg-white rounded border border-secondary border-opacity-25">
                                        <small className="text-muted d-block mb-1" style={{ fontSize: '0.8rem' }}>Every</small>
                                        <Row className="g-1" style={{ fontSize: '0.85rem' }}>
                                            <Col xs={6}>
                                                <Controller name="customRepeat" control={control} render={({ field }) => (<Form.Control type="number" min={1} placeholder="#" {...field} className="form-control-sm" />)} />
                                            </Col>
                                            <Col xs={6}>
                                                <Dropdown onSelect={(k) => k && setValue('customUnit', k as 'days' | 'weeks' | 'months' | 'years')} className="w-100">
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
                                        <small className="text-muted d-block mb-1" style={{ fontSize: '0.8rem' }}>Days</small>
                                        <ButtonGroup size="sm" className="w-100" style={{ display: 'flex', gap: '2px' }}>
                                            {dayAbbrev.map((day, idx) => (<Button key={idx} variant={selectedDaysVal.includes(idx) ? 'primary' : 'outline-secondary'} size="sm" onClick={() => toggleDay(idx)} className="flex-grow-1" title={days[idx]} style={{ fontSize: '0.75rem', padding: '0.25rem 0.3rem' }}>{day}</Button>))}
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
                                                            selected={field.value}
                                                            onChange={(d) => {
                                                                field.onChange(d);
                                                                // clear endAfter when an endDate is chosen
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