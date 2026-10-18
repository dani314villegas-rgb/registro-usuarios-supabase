// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const form = document.getElementById('registroForm');
    const tableBody = document.querySelector('#registrosTable tbody');
    const emptyState = document.getElementById('emptyState');
    const submitBtn = document.getElementById('submitBtn');
    const nombreInput = document.getElementById('nombre');
    const apellidoInput = document.getElementById('apellido');
    const cedulaInput = document.getElementById('cedula');
    const edadInput = document.getElementById('edad');

    // Notification system (toast)
    function showNotification(message, type = 'info') {
        // Remove any existing notifications
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} notification-icon"></i>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Styles for the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;

        // Close button handler
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);

        // Append to body
        document.body.appendChild(notification);
    }

    // Insertar usuario en Supabase
    async function insertarUsuario(record) {
        try {
            const { data, error } = await window.supabaseClient
                .from('usuarios')
                .insert(record)
                .select();

            if (error) throw error;
            return data;
        } catch (err) {
            throw err;
        }
    }

    // Obtener usuarios de Supabase
    async function obtenerUsuarios() {
        try {
            const { data, error } = await window.supabaseClient
                .from('usuarios')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        } catch (err) {
            throw err;
        }
    }

    // Renderizar usuarios en la tabla
    function renderizarUsuarios(usuarios) {
        // Clear table
        tableBody.innerHTML = '';

        if (usuarios && usuarios.length > 0) {
            emptyState.style.display = 'none';
            usuarios.forEach(record => {
                const row = document.createElement('tr');
                row.className = 'hover-row';
                row.innerHTML = `
                    <td class="px-4 py-2 text-sm font-medium">${record.cedula}</td>
                    <td class="px-4 py-2 text-sm">${record.nombre}</td>
                    <td class="px-4 py-2 text-sm">${record.apellido}</td>
                    <td class="px-4 py-2 text-sm">${record.edad}</td>
                    <td class="px-4 py-2 text-sm space-x-2">
                        <button class="btn-edit btn-purple bg-purple-500 hover:bg-purple-600 text-xs px-2 py-1 rounded" data-id="${record.id}" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete bg-red-500 hover:bg-red-600 text-xs px-2 py-1 rounded" data-id="${record.id}" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Add event listeners to action buttons
            document.querySelectorAll('.btn-edit').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.target.closest('button').dataset.id;
                    await editarRegistro(id);
                });
            });

            document.querySelectorAll('.btn-delete').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.target.closest('button').dataset.id;
                    if (confirm('¿Está seguro de eliminar este registro?')) {
                        await eliminarRegistro(id);
                    }
                });
            });
        } else {
            emptyState.style.display = 'block';
            emptyState.innerHTML = '<i class="fas fa-inbox me-2"></i>No hay registros aún. ¡Agrega el primero!';
        }
    }

    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-save mr-2"></i> Guardando...';

        // Get form data
        const nombre = nombreInput.value.trim();
        const apellido = apellidoInput.value.trim();
        const cedula = cedulaInput.value.trim();
        const edadStr = edadInput.value.trim();

        // Validation
        if (!nombre || !apellido || !cedula || !edadStr) {
            showNotification('Por favor, complete todos los campos.', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-save mr-2"></i> Guardar Registro';
            return;
        }

        const edad = parseInt(edadStr);
        if (isNaN(edad) || edad < 0 || edad > 150) {
            showNotification('La edad debe ser un número entre 0 y 150.', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-save mr-2"></i> Guardar Registro';
            return;
        }

        const record = {
            nombre,
            apellido,
            cedula,
            edad
        };

        try {
            // Insert into Supabase
            const data = await insertarUsuario(record);
            
            // Success
            showNotification('¡Registro guardado exitosamente!', 'success');
            form.reset();
            const usuarios = await obtenerUsuarios(); // Refresh table
            renderizarUsuarios(usuarios);

            // Reset button
            submitBtn.innerHTML = '<i class="fas fa-save mr-2"></i> Guardar Registro';
            submitBtn.disabled = false;
        } catch (err) {
            console.error('Error inserting record:', err);
            let errorMessage = 'Error al guardar el registro';
            if (err.message) {
                if (err.message.includes('Failed to fetch') || 
                    err.message.includes('CORS') || 
                    err.message.includes('Access to XMLHttpRequest') ||
                    err.message.includes('No \'Access-Control-Allow-Origin\"')) {
                    errorMessage = 'Error de CORS: No se puede conectar a Supabase. Configure CORS en Supabase para permitir origen "null" o use un servidor local.';
                } else if (err.status && err.status >= 400 && err.status < 500) {
                    errorMessage = `Error de Supabase: ${err.message} (Código: ${err.status})`;
                } else {
                    errorMessage = `Error: ${err.message}`;
                }
            }
            showNotification(errorMessage, 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-save mr-2"></i> Guardar Registro';
        }
    });

    // Edit record
    async function editarRegistro(id) {
        try {
            const { data, error } = await window.supabaseClient
                .from('usuarios')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            if (data) {
                // Populate form with record data
                nombreInput.value = data.nombre;
                apellidoInput.value = data.apellido;
                cedulaInput.value = data.cedula;
                edadInput.value = data.edad;
                // Change submit button to indicate update
                submitBtn.innerHTML = '<i class="fas fa-save mr-2"></i> Actualizar';
                submitBtn.dataset.action = 'update';
                submitBtn.dataset.id = data.id;
                // Scroll to form
                form.scrollIntoView({ behavior: 'smooth', block: 'center' });
                showNotification('Registro cargado para edición. Modifique y guarde.', 'info');
            }
        } catch (err) {
            console.error('Error fetching record for edit:', err);
            showNotification('Error al cargar el registro para edición.', 'error');
        }
    }

    // Delete record
    async function eliminarRegistro(id) {
        try {
            const { error } = await window.supabaseClient
                .from('usuarios')
                .delete()
                .eq('id', id);

            if (error) throw error;

            showNotification('Registro eliminado exitosamente.', 'success');
            const usuarios = await obtenerUsuarios(); // Refresh table
            renderizarUsuarios(usuarios);
        } catch (err) {
            console.error('Error deleting record:', err);
            let errorMessage = 'Error al eliminar el registro';
            if (err.message) {
                if (err.message.includes('Failed to fetch') || 
                    err.message.includes('CORS') || 
                    err.message.includes('Access to XMLHttpRequest') ||
                    err.message.includes('No \'Access-Control-Allow-Origin\"')) {
                    errorMessage = 'Error de CORS: No se puede conectar a Supabase. Configure CORS en Supabase para permitir origen "null" o use un servidor local.';
                } else if (err.status && err.status >= 400 && err.status < 500) {
                    errorMessage = `Error de Supabase: ${err.message} (Código: ${err.status})`;
                } else {
                    errorMessage = `Error: ${err.message}`;
                }
            }
            showNotification(errorMessage, 'error');
        }
    }

    // Initial load
    (async () => {
        try {
            const usuarios = await obtenerUsuarios();
            renderizarUsuarios(usuarios);
        } catch (err) {
            console.error('Error initial load:', err);
            let errorMessage = 'Error al cargar los registros iniciales';
            if (err.message) {
                if (err.message.includes('Failed to fetch') || 
                    err.message.includes('CORS') || 
                    err.message.includes('Access to XMLHttpRequest') ||
                    err.message.includes('No \'Access-Control-Allow-Origin\"')) {
                    errorMessage = 'Error de CORS: No se puede conectar a Supabase. Configure CORS en Supabase para permitir origen "null" o use un servidor local.';
                } else if (err.status && err.status >= 400 && err.status < 500) {
                    errorMessage = `Error de Supabase: ${err.message} (Código: ${err.status})`;
                } else {
                    errorMessage = `Error: ${err.message}`;
                }
            }
            showNotification(errorMessage, 'error');
            emptyState.style.display = 'block';
            emptyState.innerHTML = `<i class="fas fa-exclamation-triangle me-2"></i>${errorMessage}`;
        }
    })();
});