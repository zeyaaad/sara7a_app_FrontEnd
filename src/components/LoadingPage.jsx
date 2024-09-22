import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function LoadingPage() {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#121212' }}>
            <div className="text-center text-white">
               
                    <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
        </div>
    );
}

export default LoadingPage;
