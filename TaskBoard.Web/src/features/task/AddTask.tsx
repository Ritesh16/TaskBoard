import { Form, InputGroup, Col } from "react-bootstrap";
import logo from '../../assets/save.png';
import { useTasks } from "../../lib/hooks/useTasks";
import { useToast } from "../../app/shared/components/toast/useToast";
import { addTaskTitleSchema, type AddTaskTitleSchema } from "../../lib/schemas/addTaskTitleSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


export default function AddTask() {
    const { saveTaskTitle } = useTasks();
    const toast = useToast();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<AddTaskTitleSchema>({
        mode: 'onTouched',
        resolver: zodResolver(addTaskTitleSchema)
    });
    

    const onSubmit = async (data: AddTaskTitleSchema) => {
        await saveTaskTitle.mutateAsync(data, {
            onSuccess: () => {
                toast.success("Task added successfully.");
                reset();
            },
            onError: (error) => {
                console.log(error);
                toast.error("Some error has occurred while adding task.");
            }
        });
    };

    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group as={Col} controlId="validationTitle">
                    <InputGroup hasValidation>
                        <Form.Control
                            {...register('title')}
                            isInvalid={!!errors.title}
                            aria-describedby="inputGroupPrepend"
                        />
                        <InputGroup.Text id="inputGroupPrepend" style={{ cursor: 'pointer' }}>
                            <img src={logo} alt="Logo" onClick={(e) => {
                                const form = e.currentTarget.closest('form');
                                if (form) form.requestSubmit();
                            }} />
                        </InputGroup.Text>
                        <Form.Control.Feedback type="invalid">
                            Please enter the task title
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
            </Form>
        </>
    )
}