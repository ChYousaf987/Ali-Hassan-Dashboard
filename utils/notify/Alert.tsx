import Swal from 'sweetalert2';

export const showMessage = (msg = '', type = 'success') => {
    const toast :any= Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        background: 'rgb(59, 63, 92)',
        color: 'white',
        // customClass: "toast",
    });

    toast.fire({
        icon: type,
        title: msg,
        padding: '10px 20px',
    });
};

// showMessage(result?.data?.message)
// showMessage(result?.data?.message,"error")