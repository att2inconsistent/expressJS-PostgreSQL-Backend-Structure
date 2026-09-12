import {useEffect, useState} from 'react';
import api from '../../utils/api';

function PendingApproval() {
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchApplication() {
            try {
                const response = await api.get('/seller/my-application');
                setApplication(response.data.application);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchApplication();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Application Status</h1>
            <p>Status: {application?.status}</p>
        </div>
    );
}

export default PendingApproval;