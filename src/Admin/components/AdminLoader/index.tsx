const AdminLoader = () => {
    return (
        <div
            className="flex w-full items-center justify-center cli"
            style={{ height: "70vh" }}
        >
            <div className="spinner"></div>

            {/* Internal CSS */}
            <style>
                {`
                    .spinner {
                        width: 50px;
                        height: 50px;
                        border: 5px solid rgba(0, 0, 0, 0.1);
                        border-top-color: #3498db;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    }

                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
        </div>
    );
};

export default AdminLoader;
