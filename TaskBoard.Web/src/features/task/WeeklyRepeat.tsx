import { Button, ButtonGroup } from "react-bootstrap";
import { Common_Styles, DAYS_ABBREV, DAYS_FULL } from "../../lib/common/constants";
import { useWatch, type Control, type UseFormSetValue } from "react-hook-form";
import type { TaskScheduleSchema } from "../../lib/schemas/taskScheduleSchema";

interface Props {
    control: Control<TaskScheduleSchema>;
    setValue: UseFormSetValue<TaskScheduleSchema>;
}

export default function WeeklyRepeat({ control, setValue }: Props) {
    const selectedDaysVal = useWatch({ control, name: 'selectedDays', defaultValue: [] as number[] }) as number[];

    const toggleDay = (idx: number) => {
        const current = selectedDaysVal.includes(idx) ? selectedDaysVal.filter(d => d !== idx) : [...selectedDaysVal, idx];
        setValue('selectedDays', current);
    };

    return (
        <div className="mb-2 p-2 bg-white rounded border border-secondary border-opacity-25">
            <small className="text-muted d-block mb-1" style={Common_Styles.smallLabel}>Days</small>
            <ButtonGroup size="sm" className="w-100" style={{ display: 'flex', gap: '2px' }}>
                {DAYS_ABBREV.map((day, idx) => (
                    <Button
                        key={idx}
                        variant={selectedDaysVal.includes(idx) ? 'primary' : 'outline-secondary'}
                        size="sm"
                        onClick={() => toggleDay(idx)}
                        className="flex-grow-1"
                        title={DAYS_FULL[idx]}
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.3rem' }}
                    >
                        {day}
                    </Button>))}
            </ButtonGroup>
        </div>
    )
}