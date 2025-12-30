import { Badge, Button, ButtonGroup, Card, Dropdown, Form } from "react-bootstrap";
import { useTaskSchedules } from "../../lib/hooks/useTaskSchedules";
import type { Task } from "../../lib/types/Task";
import { useForm, useWatch } from "react-hook-form";
import CustomRepeat from "./CustomRepeat";
import { taskScheduleSchema, type TaskScheduleSchema } from "../../lib/schemas/taskScheduleSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import { useState } from "react";
import { Common_Styles, QUICK_DATES } from "../../lib/common/constants";
import WeeklyRepeat from "./WeeklyRepeat";
import Ends from "./Ends";
import { formatToYMD } from "../../lib/util/util";
import { useToast } from "../../app/shared/components/toast/useToast";
import TaskScheduleDetails from "./TaskScheduleDetails";

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

export default function TaskScheduleUpdate({ userTask }: { userTask?: Task }) {
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const { taskSchedule, taskScheduleLoading, saveTaskSchedules } = useTaskSchedules(userTask?.taskId);
    const toast = useToast();

    const { handleSubmit, setValue, control, reset } = useForm<TaskScheduleSchema>({
        mode: 'onTouched',
        resolver: zodResolver(taskScheduleSchema),
        defaultValues: {
            taskId: userTask?.taskId,
            ...DEFAULT_FORM_VALUES,
            startDate: userTask?.date ?? null
        } as TaskScheduleSchema
    });



    const setQuickDate = (id: string, offset: number | null) => {
        const d = new Date();
        if (offset !== null) d.setDate(d.getDate() + offset);
        else d.setMonth(d.getMonth() + 1);
        setValue('startDate', d);
        setStartDate(d);
        setValue('oneTimeOption', id);
    };

    const oneTimeOption = useWatch({ control, name: 'oneTimeOption', defaultValue: 'today' });
    const repeat = useWatch({ control, name: 'repeat', defaultValue: 'OneTime' });
    const customRepeatVal = useWatch({ control, name: 'customRepeat', defaultValue: '' });
    const customUnitVal = useWatch({ control, name: 'customUnit', defaultValue: 'days' });
   
    const onSubmit = async (data: TaskScheduleSchema) => {
        console.log(data);
        if (data.repeat === 'Weekly' && (data.selectedDays ?? []).length === 0) {
            toast.error('Please select the days.');
            return;
        }

        try {
            await saveTaskSchedules.mutateAsync(data);
            toast.success('Schedule saved successfully!');
        } catch (error: unknown) {
            const httpError = error as { response?: { data?: { message?: string } } };
            const errorMsg = httpError.response?.data?.message || 'Error adding the schedule.';
            toast.error(errorMsg);
        }
    }

    if (taskScheduleLoading) return <div>Loading Tasks...</div>

    if (taskSchedule) {
        <TaskScheduleDetails taskSchedule={taskSchedule} />
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
                                            variant={oneTimeOption === id ? 'primary' : 'outline-primary'}
                                            onClick={() => setQuickDate(id, offset)}
                                            className="flex-grow-1"
                                            style={Common_Styles.btnSmall}
                                        >
                                            {label}
                                        </Button>
                                    ))}
                                </ButtonGroup>
                            </div>
                            <div className="mb-2">
                                <small className="text-muted d-block mb-1" style={Common_Styles.smallLabel}>Or pick a date:</small>
                                <DatePicker
                                    selected={startDate}
                                    dateFormat="MM-dd-yyyy"
                                    className="form-control form-control-sm"
                                    isClearable
                                    onChange={(d: Date | null) => {
                                        setStartDate(d);
                                        setValue('oneTimeOption', null);
                                        setValue('startDate', d ? formatToYMD(d) : null);
                                    }}
                                />
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
                                            <Dropdown.Item onClick={() => setValue('repeat', 'Daily')}>Daily</Dropdown.Item>
                                            <Dropdown.Item onClick={() => setValue('repeat', 'Weekly')}>Weekly</Dropdown.Item>
                                            <Dropdown.Item onClick={() => setValue('repeat', 'Monthly')}>Monthly</Dropdown.Item>
                                            <Dropdown.Item onClick={() => setValue('repeat', 'Yearly')}>Yearly</Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item onClick={() => setValue('repeat', 'Custom')}>Custom...</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>

                                    {repeat === 'Custom' && (
                                        <CustomRepeat control={control} setValue={setValue} />
                                    )}

                                    {repeat === 'Weekly' && (
                                        <WeeklyRepeat control={control} setValue={setValue} />
                                    )}

                                    <Ends control={control} setValue={setValue} />
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
        )
    }
}