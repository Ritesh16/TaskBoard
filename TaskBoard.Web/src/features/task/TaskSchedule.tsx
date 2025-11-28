import { useEffect, useState } from "react";
import { Button, ButtonGroup, Col, Dropdown, Form, Row, Card, Badge } from "react-bootstrap";
import DatePicker from "react-datepicker";
import type { Task } from "../../lib/types/Task";
import 'react-datepicker/dist/react-datepicker.css';

export default function TaskSchedule({ userTask }: { userTask?: Task }) {
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [repeatOption, setRepeatOption] = useState<'None' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly' | 'Custom'>('None');
    const [customRepeat, setCustomRepeat] = useState('');
    const [customUnit, setCustomUnit] = useState<string>('days');
    const [selectedDays, setSelectedDays] = useState<Set<number>>(new Set());

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayAbbrev = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const handleSelect = (eventKey: string | null) => {
        if (eventKey) {
            setCustomUnit(eventKey);
        }
    };

    const toggleDay = (dayIndex: number) => {
        const newDays = new Set(selectedDays);
        if (newDays.has(dayIndex)) {
            newDays.delete(dayIndex);
        } else {
            newDays.add(dayIndex);
        }
        setSelectedDays(newDays);
    };

    const formattedDate = startDate
        ? startDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
        : 'N/A';

    const repeatSummary = repeatOption === 'None' ? 'No repeat' : 
        repeatOption === 'Custom' ? `Every ${customRepeat} ${customUnit}` : 
        repeatOption;

    useEffect(() => {
        if (userTask) {
            const meta = userTask as unknown as { details?: string; repeat?: 'None' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly' | 'Custom' };
            setStartDate(userTask.date ? new Date(userTask.date) : new Date());
            setRepeatOption(meta.repeat ?? 'None');
        }
    }, [userTask]);

    return (
        <Card className="border-0 shadow-sm">
            <Card.Body>
                {/* Date Section */}
                <div className="mb-4">
                    <h6 className="text-muted mb-3">
                        <span style={{ fontSize: '18px' }}>📅</span> Due Date
                    </h6>
                    
                    <div className="mb-3">
                        <ButtonGroup size="sm" className="w-100" style={{ display: 'flex', gap: '4px' }}>
                            <Button 
                                variant="outline-primary" 
                                onClick={() => setStartDate(new Date())}
                                className="flex-grow-1"
                            >
                                Today
                            </Button>
                            <Button 
                                variant="outline-primary" 
                                onClick={() => setStartDate(new Date(Date.now() + 24 * 60 * 60 * 1000))}
                                className="flex-grow-1"
                            >
                                Tomorrow
                            </Button>
                            <Button 
                                variant="outline-primary" 
                                onClick={() => { const d = new Date(); d.setDate(d.getDate() + 7); setStartDate(d); }}
                                className="flex-grow-1"
                            >
                                Next Week
                            </Button>
                            <Button 
                                variant="outline-primary" 
                                onClick={() => { const d = new Date(); d.setMonth(d.getMonth() + 1); setStartDate(d); }}
                                className="flex-grow-1"
                            >
                                Next Month
                            </Button>
                        </ButtonGroup>
                    </div>

                    <Row className="mb-3">
                        <Col md={8}>
                            <small className="text-muted d-block mb-2">Pick a custom date</small>
                            <DatePicker
                                selected={startDate}
                                onChange={(date: Date | null) => setStartDate(date)}
                                dateFormat="MMMM d, yyyy"
                                className="form-control"
                            />
                        </Col>
                        <Col md={4} className="d-flex align-items-end">
                            <div className="bg-light p-3 rounded w-100 text-center">
                                <small className="text-muted d-block">Selected Date</small>
                                <strong>{formattedDate}</strong>
                            </div>
                        </Col>
                    </Row>
                </div>

                <hr />

                {/* Repeat Section */}
                <div className="mb-4">
                    <h6 className="text-muted mb-3">
                        <span style={{ fontSize: '18px' }}>🔄</span> Repeat
                    </h6>

                    <div className="d-flex align-items-center gap-3 mb-3">
                        <Form.Check
                            type="switch"
                            id="repeat-switch"
                            label="Enable repeat"
                            checked={repeatOption !== 'None'}
                            onChange={(e) => setRepeatOption(e.target.checked ? 'Daily' : 'None')}
                        />
                        {repeatOption !== 'None' && (
                            <Badge bg="info">{repeatSummary}</Badge>
                        )}
                    </div>

                    {repeatOption !== 'None' && (
                        <div>
                            <Dropdown className="mb-3">
                                <Dropdown.Toggle size="sm" variant="secondary" className="w-100">
                                    {repeatOption}
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="w-100">
                                    <Dropdown.Item onClick={() => setRepeatOption('Daily')}>Daily</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setRepeatOption('Weekly')}>Weekly</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setRepeatOption('Monthly')}>Monthly</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setRepeatOption('Yearly')}>Yearly</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={() => setRepeatOption('Custom')}>Custom...</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>

                            {/* Custom Repeat */}
                            {repeatOption === 'Custom' && (
                                <div className="bg-light p-3 rounded mb-3">
                                    <small className="text-muted d-block mb-2">Repeat every...</small>
                                    <Row className="g-2">
                                        <Col xs={6}>
                                            <Form.Control
                                                type="number"
                                                min="1"
                                                placeholder="e.g., 10"
                                                value={customRepeat}
                                                onChange={(e) => setCustomRepeat(e.target.value)}
                                            />
                                        </Col>
                                        <Col xs={6}>
                                            <Dropdown onSelect={handleSelect} className="w-100">
                                                <Dropdown.Toggle size="sm" variant="secondary" className="w-100">
                                                    {customUnit}
                                                </Dropdown.Toggle>
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

                            {/* Weekly Day Selection */}
                            {repeatOption === 'Weekly' && (
                                <div className="bg-light p-3 rounded mb-3">
                                    <small className="text-muted d-block mb-2">Repeat on which days?</small>
                                    <ButtonGroup className="w-100" style={{ display: 'flex', gap: '4px' }}>
                                        {dayAbbrev.map((day, idx) => (
                                            <Button
                                                key={idx}
                                                variant={selectedDays.has(idx) ? 'primary' : 'outline-primary'}
                                                size="sm"
                                                onClick={() => toggleDay(idx)}
                                                className="flex-grow-1"
                                                title={days[idx]}
                                            >
                                                {day}
                                            </Button>
                                        ))}
                                    </ButtonGroup>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="d-flex gap-2 pt-3">
                    <Button
                        variant="primary"
                        onClick={() => {
                            // TODO: Call mutation to save schedule
                            console.log('Save', { startDate, repeatOption, customRepeat, customUnit, selectedDays: Array.from(selectedDays) });
                        }}
                        className="flex-grow-1"
                    >
                        Save Schedule
                    </Button>
                    <Button
                        variant="outline-secondary"
                        onClick={() => {
                            setStartDate(new Date());
                            setRepeatOption('None');
                            setCustomRepeat('');
                            setCustomUnit('days');
                            setSelectedDays(new Set());
                        }}
                        className="flex-grow-1"
                    >
                        Reset
                    </Button>
                </div>
            </Card.Body>
        </Card>
    )
}