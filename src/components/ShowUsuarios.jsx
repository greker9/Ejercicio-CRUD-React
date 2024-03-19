import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { alertaSuccess, alertaError, alertaWarning, alertaConfirmation } from '../functions';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const ShowUsuarios = () => {
    const url = 'https://api.escuelajs.co/api/v1/users';
    const [products, setProducts] = useState([]);
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [titleModal, setTitleModal] = useState('');
    const [operation, setOperation] = useState(1);

    const getProductos = async () => {
        const response = await axios.get(url);
        setProducts(response.data);
    }

    useEffect( () => {
        getProductos();
    });

    const openModal = (operation, id, title, role, password) => {
        setId('');
        setTitle('');
        setRole('');
        setPassword('');

        if (operation === 1) {
            setTitleModal('Registrar Producto');
            setOperation(1);
        } else if (operation === 2) {
            setTitleModal('Editar Producto');
            setId(id);
            setTitle(title);
            setRole(role);
            setPassword(password);
            setOperation(2);
        }
    }

    const enviarSolicitud = async (url, metodo, parametros) => {
        let obj = {
            method: metodo,
            url: url,
            data: parametros,
            headers: {
                "Content-Type":"application/json",
                "Accept":"application/json"
            }
        };
        await axios(obj).then( () => {
            let mensaje;

            if (metodo === 'POST') {
                mensaje = 'Se guardó el producto';
            } else if (metodo === 'PUT') {
                mensaje = 'Se editó el producto';
            } else if (metodo === 'DELETE') {
                mensaje = 'Se eliminó el producto';
            }
            alertaSuccess(mensaje);
            document.getElementById('btnCerrarModal').click();
            getProductos();
        }).catch((error) => {
            alertaError(error.response.data.message);
            console.log(error);
        });
    }

    const validar = () => {
        let payload;
        let metodo;
        let urlAxios;

        if (title === '') {
            alertaWarning('Escriba el nombre del usuario', 'name');
        } else if (role === '') {
            alertaWarning('Escriba la descripción del usuario', 'role');
        } else if (password === '') {
            alertaWarning('Escriba el precio del usuario', 'password');
        } else {
            payload = {
                title: title,
                role: role,
                password: password,
                categoryId: 6,
                images: ['https://c8.alamy.com/compes/r3yw81/el-icono-de-imagen-no-disponible-vector-plana-r3yw81.jpg']
            };

            if (operation === 1) {
                metodo = 'POST';
                urlAxios = 'https://api.escuelajs.co/api/v1/users';
            } else {
                metodo = 'PUT';
                urlAxios = `https://api.escuelajs.co/api/v1/users${id}`;
            }

            enviarSolicitud(urlAxios, metodo, payload);
        }
    }

    const deleteProducto = (id) => {
        let urlDelete = `https://api.escuelajs.co/api/v1/users${id}`;

        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: '¿Está seguro de eliminar el producto?',
            icon: 'question',
            text: 'No habrá marcha atrás',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setId(id);
                enviarSolicitud(urlDelete, 'DELETE', {});
            }
        }).catch((error) => {
            alertaError(error);
            console.log(error);
        });
    }

 return (
    <div className='App'>
        <div className='container-fluid'>
            <div className='rwo mt-3'>
                <div className='col-md-4 offset-md-4'>
                    <div className='d-grid mx-auto'>
                        <button onClick={() => openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                            <i className='fa-solid fa-circle-plus' /> Añadir
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div className='row mt-3'>
            <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                <div className='table-responsive'>
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Rol</th>
                                <th>Email</th>
                                <th>Contraseña</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className='table-group-divider'>
                            {
                                products.map( (product, i) => (
                                    <tr key={product.id}>
                                        <td>{i + 1}</td>
                                        <td>{product.name}</td>
                                        <td>{product.role}</td>
                                        <td>{product.email}</td>
                                        <td>{product.password}</td>
                                        <td>
                                            <button onClick={() => openModal(2, product.id, product.name, product.role, product.email, product.password)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                                                <i className='fa-solid fa-edit' />
                                            </button>
                                            <button onClick={() => deleteProducto(product.id)} className='btn btn-danger'>
                                                <i className='fa-solid fa-trash' />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div id='modalProducts' className='modal fade' aria-hidden='true'>
            <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <label className='h5'>{titleModal}</label>
                        <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='cloase' />
                    </div>
                    <div className='modal-body'>
                        <input type='hidden' id='id' />
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-gift' /></span>
                            <input type='text' id='title' className='form-control' placeholder='Nombre' value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-comment' /></span>
                            <input type='text' id='role' className='form-control' placeholder='Descripción' value={role} onChange={(e) => setRole(e.target.value)} />
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-dollar-sign' /></span>
                            <input type='text' id='password' className='form-control' placeholder='Precio' value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>
                    <div className='modal-footer'>
                        <button onClick={() => validar()} className='btn btn-success'>
                            <i className='fa-solid fa-floppy-disk' /> Guardar
                        </button>
                        <button id='btnCerrarModal' className='btn btn-secondary' data-bs-dismiss='modal'>
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ShowUsuarios;
