import { useEffect } from "react";
import { Button, ButtonGroup, Col, Dropdown, Form, Row, Card, Badge } from "react-bootstrap";
import DatePicker from "react-datepicker";
import type { Task } from "../../lib/types/Task";
import 'react-datepicker/dist/react-datepicker.css';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskScheduleSchema, type TaskScheduleSchema } from "../../lib/schemas/taskScheduleSchema";

export default function TaskSchedule({ userTask }: { userTask?: Task }) {
    const { control, handleSubmit, reset, setValue, watch } = useForm<any>({
        mode: 'onTouched',
        resolver: zodResolver(taskScheduleSchema),
        defaultValues: {
            taskId: userTask?.taskId,
            startDate: userTask?.date ? new Date(userTask.date) : null,
            quick: null,
            repeat: 'None',
            customRepeat: '',
            customUnit: 'days',
            selectedDays: []
        }
    });

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayAbbrev = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const quickVal = watch('quick');
    const repeat = watch('repeat');
    const customRepeatVal = watch('customRepeat');
    const customUnitVal = watch('customUnit');
    const selectedDaysVal = watch('selectedDays') ?? [];

    useEffect(() => {
        if (userTask) {
            const meta = userTask as unknown as { details?: string; repeat?: 'None' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly' | 'Custom' };
            reset({
                taskId: userTask.taskId,
                startDate: userTask.date ? new Date(userTask.date) : null,
                quick: null,
                repeat: meta.repeat ?? 'None',
                customRepeat: '',
                customUnit: 'days',
                selectedDays: []
            });
        }
    }, [userTask, reset]);

    const toggleDay = (idx: number) => {
        const current: number[] = watch('selectedDays') ?? [];
        const exists = current.includes(idx);
        const next = exists ? current.filter(d => d !== idx) : [...current, idx];
        setValue('selectedDays', next);
    };

    const onSubmit = (data: TaskScheduleSchema) => {
        console.log('Save schedule', data);
    };

    return (
        <Card className="border-0 shadow-sm">
            <Card.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <h6 className="text-muted mb-3"><span style={{ fontSize: '18px' }}>📅</span> Due Date</h6>

                        <div className="mb-3">
                            <ButtonGroup size="sm" className="w-100" style={{ display: 'flex', gap: '4px' }}>
                                <Button
                                    variant={quickVal === 'today' ? 'primary' : 'outline-primary'}
                                    onClick={() => { const d = new Date(); setValue('startDate', d); setValue('quick','today'); }}
                                    className="flex-grow-1"
                                >Today</Button>
                                <Button
                                    variant={quickVal === 'tomorrow' ? 'primary' : 'outline-primary'}
                                    onClick={() => { const d = new Date(Date.now()+24*60*60*1000); setValue('startDate', d); setValue('quick','tomorrow'); }}
                                    className="flex-grow-1"
                                >Tomorrow</Button>
                                <Button
                                    variant={quickVal === 'nextWeek' ? 'primary' : 'outline-primary'}
                                    onClick={() => { const d = new Date(); d.setDate(d.getDate()+7); setValue('startDate', d); setValue('quick','nextWeek'); }}
                                    className="flex-grow-1"
                                >Next Week</Button>
                                <Button
                                    variant={quickVal === 'nextMonth' ? 'primary' : 'outline-primary'}
                                    onClick={() => { const d = new Date(); d.setMonth(d.getMonth()+1); setValue('startDate', d); setValue('quick','nextMonth'); }}
                                    className="flex-grow-1"
                                >Next Month</Button>
                            </ButtonGroup>
                        </div>

                        <Row className="mb-3">
                            <Col md={12}>
                                <small className="text-muted d-block mb-2">Pick a custom date</small>
                                <Controller
                                    name="startDate"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            selected={field.value}
                                            onChange={(d) => { field.onChange(d); setValue('quick', null); }}
                                            dateFormat="MMMM d, yyyy"
                                            className="form-control"
                                        />
                                    )}
                                />
                            </Col>
                        </Row>
                    </div>

                    <hr />

                    <div className="mb-4">
                        <h6 className="text-muted mb-3"><span style={{ fontSize: '18px' }}>🔄</span> Repeat</h6>

                        <div className="d-flex align-items-center gap-3 mb-3">
                            <Form.Check
                                type="switch"
                                id="repeat-switch"
                                label="Enable repeat"
                                checked={repeat !== 'None'}
                                onChange={(e) => setValue('repeat', e.target.checked ? 'Daily' : 'None')}
                            />
                            {repeat !== 'None' && (<Badge bg="info">{repeat === 'Custom' ? `Every ${customRepeatVal} ${customUnitVal}` : repeat}</Badge>)}
                        </div>

                        {repeat !== 'None' && (
                            <div>
                                <Dropdown className="mb-3">
                                    <Dropdown.Toggle size="sm" variant="secondary" className="w-100">{repeat}</Dropdown.Toggle>
                                    <Dropdown.Menu className="w-100">
                                        <Dropdown.Item onClick={() => setValue('repeat','Daily')}>Daily</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setValue('repeat','Weekly')}>Weekly</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setValue('repeat','Monthly')}>Monthly</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setValue('repeat','Yearly')}>Yearly</Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={() => setValue('repeat','Custom')}>Custom...</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>

                                {repeat === 'Custom' && (
                                    <div className="bg-light p-3 rounded mb-3">
                                        <small className="text-muted d-block mb-2">Repeat every...</small>
                                        <Row className="g-2">
                                            <Col xs={6}>
                                                <Controller
                                                    name="customRepeat"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Form.Control type="number" min={1} placeholder="e.g., 10" {...field} />
                                                    )}
                                                />
                                            </Col>
                                            <Col xs={6}>
                                                <Dropdown onSelect={(k) => setValue('customUnit', k as any)} className="w-100">
                                                    <Dropdown.Toggle size="sm" variant="secondary" className="w-100">{customUnitVal}</Dropdown.Toggle>
                                                    <Dropdown.Menu className="w-100">
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
                                    <div className="bg-light p-3 rounded mb-3">
                                        <small className="text-muted d-block mb-2">Repeat on which days?</small>
                                        <ButtonGroup className="w-100" style={{ display: 'flex', gap: '4px' }}>
                                            {dayAbbrev.map((day, idx) => (
                                                <Button key={idx} variant={selectedDaysVal.includes(idx) ? 'primary' : 'outline-primary'} size="sm" onClick={() => toggleDay(idx)} className="flex-grow-1" title={days[idx]}>{day}</Button>
                                            ))}
                                        </ButtonGroup>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>

                    <div className="d-flex gap-2 pt-3">
                        <Button variant="primary" type="submit" className="flex-grow-1">Save Schedule</Button>
                        <Button variant="outline-secondary" className="flex-grow-1" onClick={() => reset()}>Reset</Button>
                    </div>

                </Form>
            </Card.Body>
        </Card>
    );
}