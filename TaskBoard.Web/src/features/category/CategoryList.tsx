import { Table } from "react-bootstrap";
import { useCategory } from "../../lib/hooks/useCategory"

export default function CategoryList() {
    const { userCategories, userCategoriesLoading } = useCategory();

    if (userCategoriesLoading) return (
        <div className="text-muted text-center py-5">
            <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading details...</p>
        </div>
    );

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Tasks</th>
                </tr>
            </thead>
            <tbody>
                {userCategories.map((uc) => (
                    <tr>
                        <td>{uc.categoryId}</td>
                        <td>{uc.name}</td>
                        <td>{uc.tasks.length}</td>
                    </tr>
                ))

                }

            </tbody>
        </Table>
    )
}