import { Alert } from "react-bootstrap";

type AlertType =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark';

interface AlertProps {
    type: AlertType;
    message: string;
    heading?: string;
    onClose?: () => void;
}

export default function AlertNotification({
    type = 'info',
    heading,
    message,
    onClose,
}: AlertProps) {
    if (!message) {
        return null;
    }

    return (
        <>
            <Alert variant={type} onClose={onClose} dismissible>
                <Alert.Heading>{heading}</Alert.Heading>
                <p>
                    {message}
                </p>
            </Alert>
        </>
    )
}
