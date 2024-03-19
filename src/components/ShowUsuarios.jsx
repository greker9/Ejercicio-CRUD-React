import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { alertaSuccess, alertaError, alertaWarning, alertaConfirmation } from '../functions';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const ShowUsuarios = () => {
    const url = 'https://api.escuelajs.co/api/v1/users';
    const [usuarios, setusuarios] = useState([]);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [titleModal, setTitleModal] = useState('');
    const [operation, setOperation] = useState(1);

    const getUsuarios = async () => {
        const response = await axios.get(url);
        setusuarios(response.data);
    }

    useEffect( () => {
        getUsuarios();
    });

    const openModal = (operation, id, name, role, password) => {
        setId('');
        setName('');
        setRole('');
        setEmail('');
        setPassword('');
        

        if (operation === 1) {
            setTitleModal('Registrar Usuarios');
            setOperation(1);
        } else if (operation === 2) {
            setTitleModal('Editar Usuarios');
            setId(id);
            setName(name);
            setRole(role);
            setEmail(email);
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
                mensaje = 'Se guardó el usuario';
            } else if (metodo === 'PUT') {
                mensaje = 'Se editó el usuario';
            } else if (metodo === 'DELETE') {
                mensaje = 'Se eliminó el usuario';
            }
            alertaSuccess(mensaje);
            document.getElementById('btnCerrarModal').click();
            getUsuarios();
        }).catch((error) => {
            alertaError(error.response.data.message);
            console.log(error);
        });
    }

    const validar = () => {
        let payload;
        let metodo;
        let urlAxios;

        if (name === '') {
            alertaWarning('Escriba el nombre del usuario', 'name');
        } else if (role === '') {
            alertaWarning('Escriba el rol del usuario', 'role');
        } else if (email === '') {
            alertaWarning('Escriba el correo del usuario', 'email');
        
        } else if (password === '') {
            alertaWarning('Escriba la contraseña del usuario', 'password');
        } else {
            payload = {
                name: name,
                role: role,
                email: email,
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
            title: '¿Está seguro de eliminar el usuario?',
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
                        <button onClick={() => openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalusuarios'>
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
                                <th>Avatar</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className='table-group-divider'>
                            {
                                usuarios.map( (product, i) => (
                                    <tr key={product.id}>
                                        <td>{i + 1}</td>
                                        <td>{product.name}</td>
                                        <td>{product.role}</td>
                                        <td>{product.email}</td>
                                        <td>{product.password}</td>
                                        <td><img src={product.avatar} width="100" height="100"></img></td>
                                        <td>
                                            <button onClick={() => openModal(2, product.id, product.name, product.role, product.email, product.password, product.avatar)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalusuarios'>
                                                <i className='fa-solid fa-edit' />
                                            </button>
                                            <button onClick={() => deleteProducto(product.id)} className='btn btn-danger'>
                                                <i className='fa-solid fa-trash-can' />
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

        <div id='modalusuarios' className='modal fade' aria-hidden='true'>
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
                            <input type='text' id='name' className='form-control' placeholder='Nombre' value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-comment' /></span>
                            <input type='text' id='role' className='form-control' placeholder='Rol' value={role} onChange={(e) => setRole(e.target.value)} />
                        </div>
                       
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-envelope' /></span>
                            <input type='text' id='email' className='form-control' placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                       
                       
                       
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-key' /></span>
                            <input type='text' id='password' className='form-control' placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
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
