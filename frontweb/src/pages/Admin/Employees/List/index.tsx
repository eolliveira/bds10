import './styles.css';

import Pagination from 'components/Pagination';
import EmployeeCard from 'components/EmployeeCard';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { requestBackend } from 'util/requests';
import { Employee } from 'types/employee';
import { SpringPage } from 'types/vendor/spring';
import { hasAnyRoles } from 'util/auth';

const List = () => {
  const [employees, setEmployees] = useState<SpringPage<Employee>>();

  useEffect(() => {
    requestBackend({ url: '/employees', withCredentials: true }).then(
      (response) => {
        setEmployees(response.data);
      }
    );
  }, []);

  const handlePageChange = (pageNumber: number) => {
    // to do
  };

  return (
    <>
      {hasAnyRoles(['ROLE_ADMIN']) && (
        <Link to="/admin/employees/create">
          <button className="btn btn-primary text-white btn-crud-add">
            ADICIONAR
          </button>
        </Link>
      )}

      {employees?.content.map((employee) => (
        <EmployeeCard employee={employee} key={employee.id} />
      ))}

      <Pagination
        forcePage={0}
        pageCount={1}
        range={3}
        onChange={handlePageChange}
      />
    </>
  );
};

export default List;
