import { useEffect, useRef, useState } from 'react';
import CVEditButton from './edit.jsx';

export default function GeneralInfoSection({ submitSignal = 0 }) {
    const [isEditing, setIsEditing] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        familyName: '',
        email: '',
        phone: ''
    });
    const [submittedData, setSubmittedData] = useState(null);
    const lastSubmitSignal = useRef(submitSignal);

    useEffect(() => {
        if (submitSignal === lastSubmitSignal.current) return;
        lastSubmitSignal.current = submitSignal;
        setSubmittedData(formData);
        setIsEditing(false);
    }, [formData, submitSignal]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    return (
        <section>
            <h2>General Information</h2>

            {isEditing ? (
                <>
                    <label>
                        Name: <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" />
                    </label>
                    <label>
                        Family Name: <input type="text" name="familyName" value={formData.familyName} onChange={handleChange} placeholder="Enter your family name" />
                    </label>
                    <label>
                        Email: <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@mailprovider.com" />
                    </label>
                    <label>
                        Phone: <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+216 12 345 678" />
                    </label>
                </>
            ) : (
                <>
                    <p><strong>Name:</strong> {submittedData?.name || 'N/A'}</p>
                    <p><strong>Family Name:</strong> {submittedData?.familyName || 'N/A'}</p>
                    <p><strong>Email:</strong> {submittedData?.email || 'N/A'}</p>
                    <p><strong>Phone:</strong> {submittedData?.phone || 'N/A'}</p>
                    <CVEditButton onEdit={handleEdit} />
                </>
            )}
        </section>
    );
}