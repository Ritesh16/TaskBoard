import { Controller, useWatch, type Control, type UseFormSetValue } from 'react-hook-form';
import { Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import type { TaskScheduleSchema } from '../../lib/schemas/taskScheduleSchema';
import { formatToYMD } from '../../lib/util/util';
import { useState } from 'react';

interface Props {
  control: Control<TaskScheduleSchema>;
  setValue: UseFormSetValue<TaskScheduleSchema>;
}

export default function Ends({ control, setValue }: Props) {
  const endType = useWatch({ control, name: 'endType', defaultValue: 'never' });
  const [endDate, setEndDate] = useState<Date | null>();

  return (
    <div className="p-2 bg-white rounded border border-secondary border-opacity-25" style={{ fontSize: '0.85rem' }}>
      <small className="text-muted d-block mb-1" style={{ fontSize: '0.8rem' }}>Ends</small>
      <div className="d-flex flex-column gap-1">
        <Form.Check
          type="radio"
          name="endType"
          id="endType-never"
          label={<small>Never</small>}
          checked={endType === 'never'}
          onChange={() => {
            setValue('endType', 'never');
            setValue('endAfter', '');
            setValue('endDate', null);
          }}
          style={{ fontSize: '0.85rem' }}
        />

        <Form.Check
          type="radio"
          name="endType"
          id="endType-date"
          label={<small>On date</small>}
          checked={endType === 'endDate'}
          onChange={() => setValue('endType', 'endDate')}
          style={{ fontSize: '0.85rem' }}
        />

        {endType === 'endDate' && (
          <div className="ms-3 mt-1">
                <DatePicker
                  selected={endDate}
                   dateFormat="MM-dd-yyyy"
                   className="form-control form-control-sm"
                   isClearable
                  onChange={(d: Date | null) => {
                    setEndDate(d);
                    setValue('endDate', d ? formatToYMD(d) : null);
                  }}
                />
             
          </div>
        )}

        <Form.Check
          type="radio"
          name="endType"
          id="endType-after"
          label={<small>After # times</small>}
          checked={endType === 'endAfter'}
          onChange={() => setValue('endType', 'endAfter')}
          style={{ fontSize: '0.85rem' }}
        />

        {endType === 'endAfter' && (
          <div className="ms-3 mt-1">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <Controller
                name="endAfter"
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <Form.Control
                    type="number"
                    min={1}
                    placeholder="#"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const v = e.target.value;
                      field.onChange(v);
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
  );
}
