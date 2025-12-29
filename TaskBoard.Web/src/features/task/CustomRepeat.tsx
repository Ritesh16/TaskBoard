import { Controller, useWatch, type Control, type UseFormSetValue } from 'react-hook-form';
import { Row, Col, Dropdown, Form } from 'react-bootstrap';
import type { TaskScheduleSchema } from '../../lib/schemas/taskScheduleSchema';

interface Props {
  control: Control<TaskScheduleSchema>;
  setValue: UseFormSetValue<TaskScheduleSchema>;
}

export default function CustomRepeat({ control, setValue }: Props) {
  const customUnitVal = useWatch({ control, name: 'customUnit', defaultValue: 'days' }) as 'days' | 'weeks' | 'months' | 'years';

  return (
    <div className="mb-2 p-2 bg-white rounded border border-secondary border-opacity-25">
      <small className="text-muted d-block mb-1" style={{ fontSize: '0.8rem' }}>Every</small>
      <Row className="g-1" style={{ fontSize: '0.85rem' }}>
        <Col xs={6}>
          <Controller
            name="customRepeat"
            control={control}
            defaultValue={''}
            render={({ field }) => (
              <Form.Control
                type="number"
                min={1}
                placeholder="#"
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value)}
                className="form-control-sm"
              />
            )}
          />
        </Col>
        <Col xs={6}>
          <Dropdown onSelect={(k) => k && setValue('customUnit', k as 'days' | 'weeks' | 'months' | 'years')} className="w-100">
            <Dropdown.Toggle size="sm" variant="secondary" className="w-100" style={{ fontSize: '0.85rem' }}>
              {customUnitVal}
            </Dropdown.Toggle>
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
  );
}
