import './styles.css';
import { Employee } from 'types/employee';
import { Department } from 'types/department';
import { useState } from 'react';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';

import { requestBackend } from 'util/requests';
import { useHistory } from 'react-router-dom';
import { AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';

const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Employee>();
  const history = useHistory();

  const [selectDepartments, setSelectDepartments] = useState<Department[]>([]);

  useEffect(() => {
    requestBackend({ withCredentials: true, url: '/departments' }).then(
      (response) => {
        setSelectDepartments(response.data);
      }
    );
  }, []);

  const onSubmit = (formData: Employee) => {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: '/employees',
      data: formData,
      withCredentials: true,
    };
    requestBackend(config)
      .then(() => {
        toast.info('Cadastrado com sucesso');
        history.push('/admin/employees');
      })
      .catch(() => toast.error('Erro ao cadastrar o funcionário'));
  };

  const handleCancel = () => {
    history.push('/admin/employees');
  };

  return (
    <div className="employee-crud-container">
      <div className="base-card employee-crud-form-card">
        <h1 className="employee-crud-form-title">INFORME OS DADOS</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row employee-crud-inputs-container">
            <div className="col employee-crud-inputs-left-container">
              <div className="margin-bottom-30">
                <input
                  {...register('name', {
                    required: 'Campo obrigatório',
                  })}
                  name="name"
                  data-testid="name"
                  type="text"
                  placeholder="Nome do funcionário"
                  className={`form-control base-input ${
                    errors.name ? 'is-invalid' : ''
                  }`}
                />
                <div className="invalid-feedback d-block">
                  {errors.name?.message}
                </div>

                <input
                  {...register('email', {
                    required: 'Campo obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido',
                    },
                  })}
                  name="email"
                  data-testid="email"
                  type="text"
                  placeholder="Email do funcionário"
                  className={`form-control base-input ${
                    errors.name ? 'is-invalid' : ''
                  }`}
                />
                <div className="invalid-feedback d-block">
                  {errors.email?.message}
                </div>

                <div className="margin-bottom-30 ">
                  <Controller
                    name="department"
                    rules={{ required: true }}
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="Departamento"
                        aria-label="Departamento"
                        options={selectDepartments}
                        classNamePrefix="product-crud-select"
                        getOptionLabel={(department: Department) =>
                          department.name
                        }
                        getOptionValue={(department: Department) =>
                          String(department.id)
                        }
                      />
                    )}
                  />
                  {errors.department && (
                    <div className="invalid-feedback d-block">
                      Campo obrigatório
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="employee-crud-buttons-container">
            <button
              className="btn btn-outline-danger employee-crud-button"
              onClick={handleCancel}
            >
              CANCELAR
            </button>
            <button className="btn btn-primary employee-crud-button text-white">
              SALVAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
